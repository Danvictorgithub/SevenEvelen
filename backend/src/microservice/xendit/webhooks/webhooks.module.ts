import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [WebhooksController],
  providers: [WebhooksService],
  imports: [PrismaModule]
})
export class WebhooksModule { }
