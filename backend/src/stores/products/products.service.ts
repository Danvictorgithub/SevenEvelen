import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }
  // create(createProductDto: CreateProductDto) {
  //   return 'This action adds a new product';
  // }

  async findAll(storeId: number) {
    return await this.prisma.product.findMany({ where: { storeId } });
  }

  async findOne(id: number, storeId: number) {
    const product = await this.prisma.product.findUnique({ relationLoadStrategy: 'join', where: { id, storeId }, include: { product: { include: { productType: true, brand: true, vendor: true } } } });
    if (!product) {
      throw new NotFoundException("Product Not Found");
    }
    const productsSold = (await this.prisma.transactionItem.aggregate({ where: { productId: product.id }, _count: { quantity: true } }))._count.quantity;
    const updatedProductInfo = { ...product, productsSold }
    return updatedProductInfo;
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  async remove(id: number, storeId: number) {
    const product = await this.prisma.product.findUnique({ where: { id, storeId } });
    if (!product) {
      throw new NotFoundException("Product Not Found");
    }
    return this.prisma.product.delete({ where: { id } });
  }
}
