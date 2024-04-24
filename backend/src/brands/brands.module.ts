import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseModule } from 'src/microservice/supabase/supabase.module';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports: [PrismaModule, SupabaseModule]
})
export class BrandsModule { }
