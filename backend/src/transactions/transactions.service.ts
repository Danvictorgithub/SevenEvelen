import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createTransactionDto: CreateTransactionDto) {
    const user = await this.prisma.user.findUnique({ where: { id: createTransactionDto.userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const products = await this.prisma.product.findMany({ where: { id: { in: createTransactionDto.products } }, include: { product: true } });
    if (products.length != createTransactionDto.products.length) {
      throw new BadRequestException("Some products not found");
    }
    if (!createTransactionDto.totalAmount) {
      const totalAmount = products.reduce((acc, productItem) => {
        const product = products.find((product) => product.id === productItem.id);
        return acc + ((product.product.originalPrice + ((product.markupRate / 100) * product.product.originalPrice)));
      }, 0);
      createTransactionDto.totalAmount = totalAmount;
    }
    const { products: productArray, ...payload } = createTransactionDto;
    return this.prisma.transaction.create({
      data: {
        ...payload,
        transactionItems: { createMany: { data: products.map((cartItem) => ({ productId: cartItem.productId, quantity: 1 })) } }
      },
      include: { transactionItems: { include: { product: { include: { product: true } } } } }
    });
  }

  async findAll() {
    return this.prisma.transaction.findMany({ include: { transactionItems: { include: { product: { include: { product: true } } } } } });
  }

  async findOne(id: string) {
    return this.prisma.transaction.findUnique({ where: { id }, include: { transactionItems: { include: { product: { include: { product: true } } } } } });
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    if (updateTransactionDto.userId) {
      var user = await this.prisma.user.findUnique({ where: { id: updateTransactionDto.userId } });
      if (!user) {
        throw new NotFoundException("User not found");
      }
    }
    if (updateTransactionDto.products) {
      const products = await this.prisma.product.findMany({ where: { id: { in: updateTransactionDto.products } }, include: { product: true } });
      if (products.length != updateTransactionDto.products.length) {
        throw new BadRequestException("Some products not found");
      }
      if (!updateTransactionDto.totalAmount) {
        const totalAmount = products.reduce((acc, productItem) => {
          const product = products.find((product) => product.id === productItem.id);
          return acc + ((product.product.originalPrice + ((product.markupRate / 100) * product.product.originalPrice)));
        }, 0);
        updateTransactionDto.totalAmount = totalAmount;
      }
      const { products: productArray, ...payload } = updateTransactionDto;
      await this.prisma.transactionItem.deleteMany({ where: { transactionId: id } });
      await this.prisma.transactionItem.createMany({ data: products.map((cartItem) => ({ productId: cartItem.productId, quantity: 1, transactionId: id })) });
      await this.prisma.transaction.update({ where: { id }, data: payload, include: { transactionItems: { include: { product: { include: { product: true } } } } } });
    }
    const { products: productArray, ...payload } = updateTransactionDto;
    return this.prisma.transaction.update({ where: { id }, data: payload });
  }

  async remove(id: string) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });
    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }
    return this.prisma.transaction.delete({ where: { id } });
  }
}
