import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createProductDto: CreateProductDto) {
    const store = await this.prisma.store.findUnique({ where: { id: createProductDto.storeId } });
    if (!store) {
      throw new NotFoundException("Store not found");
    }
    const vendorProduct = await this.prisma.vendorProduct.findUnique({ where: { id: createProductDto.productId } });
    if (!vendorProduct) {
      throw new NotFoundException("VendorProduct not found");
    }
    const product = await this.prisma.product.findUnique({ where: { storeId_productId: { productId: createProductDto.productId, storeId: createProductDto.storeId } } });
    if (product) {
      throw new BadRequestException("Product already exists in this store");
    }
    return await this.prisma.product.create({
      data: createProductDto
    });
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    if (updateProductDto.storeId) {
      const productExist = await this.prisma.product.findUnique({ where: { storeId_productId: { productId: product.productId, storeId: updateProductDto.storeId } } });
      if (productExist) {
        throw new BadRequestException("Product already exists in this store");
      }
    }
    if (updateProductDto.productId) {
      const productExist = await this.prisma.product.findUnique({ where: { storeId_productId: { productId: updateProductDto.productId, storeId: product.storeId } } });
      if (productExist) {
        throw new BadRequestException("Product already exists in this store");
      }
    }
    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto
    });
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return this.prisma.product.delete({ where: { id } });
  }
}
