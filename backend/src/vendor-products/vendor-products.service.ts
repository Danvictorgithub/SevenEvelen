import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorProductDto } from './dto/create-vendor-product.dto';
import { UpdateVendorProductDto } from './dto/update-vendor-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/microservice/supabase/supabase.service';

@Injectable()
export class VendorProductsService {
  constructor(private readonly prisma: PrismaService, private readonly supabase: SupabaseService) { }
  async create(createVendorProductDto: CreateVendorProductDto, image: Express.Multer.File) {
    if (image) {
      createVendorProductDto.image = await this.supabase.uploadImage(image);
    }
    const brand = await this.prisma.brand.findUnique({ where: { id: createVendorProductDto.brandId } });
    if (!brand) {
      throw new NotFoundException("Brand not found");
    }
    const category = await this.prisma.productType.findUnique({ where: { id: createVendorProductDto.productTypeId } });

    if (!category) {
      throw new NotFoundException("Category not found");
    }
    const vendor = await this.prisma.vendor.findUnique({ where: { id: createVendorProductDto.vendorId } });
    if (!vendor) {
      throw new NotFoundException("Vendor not found");
    }
    return this.prisma.vendorProduct.create({ data: createVendorProductDto });
  }

  async findAll() {
    return this.prisma.vendorProduct.findMany();
  }

  async findOne(id: number) {
    const vendorProduct = await this.prisma.vendorProduct.findUnique({ where: { id } });
    if (!vendorProduct) {
      throw new NotFoundException("Vendor product not found");
    }
    return vendorProduct
  }

  async update(id: number, updateVendorProductDto: UpdateVendorProductDto, image: Express.Multer.File) {
    const vendorProduct = await this.prisma.vendorProduct.findUnique({ where: { id } });
    if (!vendorProduct) {
      throw new NotFoundException("Vendor product not found");
    }
    if (image) {
      updateVendorProductDto.image = await this.supabase.uploadImage(image);
      this.supabase.deleteImage(vendorProduct.image)
    }
    if (updateVendorProductDto.brandId) {
      const brand = await this.prisma.brand.findUnique({ where: { id: updateVendorProductDto.brandId } });
      if (!brand) {
        throw new NotFoundException("Brand not found");
      }
    }
    if (updateVendorProductDto.productTypeId) {
      const category = await this.prisma.productType.findUnique({ where: { id: updateVendorProductDto.productTypeId } });
      if (!category) {
        throw new NotFoundException("Category not found");
      }
    }
    if (updateVendorProductDto.vendorId) {
      const vendor = await this.prisma.vendor.findUnique({ where: { id: updateVendorProductDto.vendorId } });
      if (!vendor) {
        throw new NotFoundException("Vendor not found");
      }
    }
    return this.prisma.vendorProduct.update({ where: { id }, data: updateVendorProductDto });
  }

  async remove(id: number) {
    const vendorProduct = await this.prisma.vendorProduct.findUnique({ where: { id } });
    if (!vendorProduct) {
      throw new NotFoundException("Vendor product not found");
    }
    this.supabase.deleteImage(vendorProduct.image);
    return this.prisma.vendorProduct.delete({ where: { id } });
  }
}
