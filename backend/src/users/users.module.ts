import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartModule } from './cart/cart.module';
import { TransactionsModule } from './transactions/transactions.module';
import { VendorModule } from './vendor/vendor.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, CartModule, TransactionsModule, VendorModule]
})
export class UsersModule { }
