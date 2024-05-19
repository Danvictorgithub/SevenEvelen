import { Module } from '@nestjs/common';
import { XenditService } from './xendit.service';
import { XenditController } from './xendit.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [XenditController],
  providers: [XenditService],
  imports: [PrismaModule]
})
export class XenditModule { }
