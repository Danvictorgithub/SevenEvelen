import { Module } from '@nestjs/common';
import { ReordersService } from './reorders.service';
import { ReordersController } from './reorders.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ReordersController],
  providers: [ReordersService],
  imports: [PrismaModule]
})
export class ReordersModule { }
