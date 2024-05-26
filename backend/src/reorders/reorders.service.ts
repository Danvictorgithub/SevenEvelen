import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReorderDto } from './dto/create-reorder.dto';
import { UpdateReorderDto } from './dto/update-reorder.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReordersService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createReorderDto: CreateReorderDto) {
    const reorderProducts = await this.prisma.product.findMany({ where: { id: { in: createReorderDto.products } }, include: { product: true } });
    if (reorderProducts.length !== createReorderDto.products.length) {
      throw new BadRequestException("Some products not found");
    }
    const vendorProducts = reorderProducts.reduce((acc, product) => {
      if (!acc[product.product.vendorId]) {
        acc[product.product.vendorId] = []
      }
      acc[product.product.vendorId].push(product)
      return acc;
    }, {});
    const reorders = Object.keys(vendorProducts).map(vendorId => {
      const reorderItems: Array<{ productId: number, quantity: number }> = vendorProducts[vendorId].map(product => {
        return { productId: product.id, quantity: Math.floor((Math.random() * 50) + 50) }
      })
      return this.prisma.reorder.create({
        data: {
          vendorId: parseInt(vendorId),
          reorderItems: { createMany: { data: reorderItems } }
        }
      })
    })
    return reorders
  }

  findAll() {
    return `This action returns all reorders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reorder`;
  }

  update(id: number, updateReorderDto: UpdateReorderDto) {
    return `This action updates a #${id} reorder`;
  }

  remove(id: number) {
    return `This action removes a #${id} reorder`;
  }
}
