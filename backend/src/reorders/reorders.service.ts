import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReorderDto } from './dto/create-reorder.dto';
import { UpdateReorderDto } from './dto/update-reorder.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ReordersService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createReorderDto: CreateReorderDto) {
    const products = await this.prisma.product.findMany({ where: { id: { in: createReorderDto.products } }, include: { product: true } });
    if (products.length !== createReorderDto.products.length) {
      throw new BadRequestException("Some products not found");
    }
    type ProductsType = typeof products
    const vendorProducts: { [key: string]: ProductsType } = products.reduce((acc, product) => {
      if (!acc[product.product.vendorId]) {
        acc[product.product.vendorId] = []
      }
      acc[product.product.vendorId].push(product)
      return acc;
    }, {});
    const reorders = await this.prisma.reorder.createManyAndReturn({
      data: Object.entries(vendorProducts).map(([vendorId, products]) => {
        return {
          vendorId: +vendorId,
        }
      })
    })
    const reorderItemsInput = Object.entries(vendorProducts).map(([vendorId, products]) => {
      const inputs = products.map(product => {
        return {
          quantity: createReorderDto.quantity,
          reorderId: reorders.find(reorder => reorder.vendorId === +vendorId).id,
          productId: product.id
        }
      })
      return inputs;
    })
    const reorderItemsParsed = reorderItemsInput.flat();
    const reorderItems = await this.prisma.reorderItems.createMany({
      data: reorderItemsParsed
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
