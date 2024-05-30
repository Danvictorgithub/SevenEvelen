import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { CronjobsController } from './cronjobs.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CronjobsController],
  providers: [CronjobsService],
  imports: [PrismaModule]
})
export class CronjobsModule { }
