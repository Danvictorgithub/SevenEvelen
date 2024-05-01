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
