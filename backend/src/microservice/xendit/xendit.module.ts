import { Module } from '@nestjs/common';
import { XenditService } from './xendit.service';
import { XenditController } from './xendit.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  controllers: [XenditController],
  providers: [XenditService],
  imports: [PrismaModule, WebhooksModule]
})
export class XenditModule { }
