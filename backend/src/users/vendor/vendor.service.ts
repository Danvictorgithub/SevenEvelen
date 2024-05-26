import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/microservice/supabase/supabase.service';
import { CreateVendorProductDto } from './dto/create-vendor-product.dto';
import { UpdateVendorProductDto } from './dto/update-vendor-product.dto';

@Injectable()
export class VendorService {
  constructor(private readonly prisma: PrismaService, private readonly supabase: SupabaseService) { }
  async create(createVendorDto: CreateVendorDto, image: Express.Multer.File | null) {
    const user = await this.prisma.user.findUnique({ where: { id: createVendorDto.userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (user.vendor) {
      throw new BadRequestException("User is already a vendor");
    }
    if (image) {
      createVendorDto.image = await this.supabase.uploadImage(image);
    }
    const newVendor = await this.prisma.vendor.create({
      data: createVendorDto
    })
    return newVendor;
  }

  async findSelf(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new NotFoundException("Vendor doesn't have a profile");
    }
    return await this.prisma.vendor.findUnique({ where: { userId } });
  }


  async update(userId: number, updateVendorDto: UpdateVendorDto, image: Express.Multer.File) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) {
      throw new NotFoundException("Vendor not found")
    }
    if (image) {
      updateVendorDto.image = await this.supabase.uploadImage(image);
      this.supabase.deleteImage(vendor.image);
    }
    if (updateVendorDto.userId) {
      throw new UnauthorizedException();
    }
    const updatedVendor = await this.prisma.vendor.update({ where: { userId }, data: updateVendorDto })
    return updatedVendor;
  }
  async findAllProducts(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile");
    }
    const vendorProducts = await this.prisma.vendorProduct.findMany({ where: { vendorId: user.vendor.id } });
    return vendorProducts;
  }
  async findOneProduct(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile");
    }
    const vendorProduct = await this.prisma.vendorProduct.findUnique({ where: { vendorId: user.vendor.id, id } });
    if (!vendorProduct) {
      throw new NotFoundException("Vendor Product Not Found");
    }
    return vendorProduct;
  }
  async createVendorProduct(userId: number, createVendorProductDto: CreateVendorProductDto, image: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile");
    }
    createVendorProductDto.vendorId = user.vendor.id;
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
    const newVendorProduct = await this.prisma.vendorProduct.create({ data: createVendorProductDto });
    return newVendorProduct;
  }
  async updateVendorProduct(userId: number, updateVendorProductDto: UpdateVendorProductDto, image: Express.Multer.File, id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile");
    }
    updateVendorProductDto.vendorId = user.vendor.id;
    const vendorProduct = await this.prisma.vendorProduct.findUnique({ where: { vendorId: user.vendor.id, id } });
    if (!vendorProduct) {
      throw new NotFoundException("Vendor Product Not Found");
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
    const updatedVendorProduct = await this.prisma.vendorProduct.update({ where: { id }, data: updateVendorProductDto });
    return updatedVendorProduct;
  }
  async deleteVendorProduct(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile")
    }
    const vendorProduct = await this.prisma.vendorProduct.findUnique({ where: { id, vendorId: user.vendor.id } });
    if (!vendorProduct) {
      throw new NotFoundException("Vendor Product Not Found");
    }
    return await this.prisma.vendorProduct.delete({ where: { id: vendorProduct.id } });
  }
}
