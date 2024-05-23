import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { transactionQueryDto } from './dto/transactionQuery.dto';
import { User } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) { }
  // create(createTransactionDto: CreateTransactionDto) {
  //   return 'This action adds a new transaction';
  // }

  async findAll(query: transactionQueryDto, user: User) {
    if (Object.keys(query).length > 0) {
      if (!query.page || !query.take) {
        throw new BadRequestException('Page and take query parameters are required')
      }
      const transactions = await this.prisma.transaction.findMany({ where: { userId: user.id }, skip: (query.page - 1) * query.take, take: query.take });
      // const maxPage = Math.floor(await this.prisma.transaction.count({ where: { userId: user.id } }) / query.take)
      const transactionCount = await this.prisma.transaction.findMany({ where: { userId: user.id } });
      const maxPage = Math.floor(transactionCount.length / query.take);
      return { transactions, maxPage: maxPage == 0 ? 1 : maxPage, transactionCount };
    }
    const transactions = await this.prisma.transaction.findMany({ where: { userId: user.id } });
    return transactions;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} transaction`;
  // }

  // update(id: number, updateTransactionDto: UpdateTransactionDto) {
  //   return `This action updates a #${id} transaction`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} transaction`;
  // }
}
