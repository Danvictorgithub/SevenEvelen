import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { transactionQueryDto } from './dto/transactionQuery.dto';
import { JwtAuthGuard } from 'src/authentication/auth/jwt.auth.guard';
import { User } from '@prisma/client';

@Controller('user-transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  // @Post()
  // create(@Body() createTransactionDto: CreateTransactionDto) {
  //   return this.transactionsService.create(createTransactionDto);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipUndefinedProperties: true })) query: transactionQueryDto, @Request() req: { user: User }) {
    return this.transactionsService.findAll(query, req.user);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.transactionsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
  //   return this.transactionsService.update(+id, updateTransactionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transactionsService.remove(+id);
  // }
}
