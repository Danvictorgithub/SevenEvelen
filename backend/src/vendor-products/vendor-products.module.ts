import { Module } from '@nestjs/common';
import { VendorProductsService } from './vendor-products.service';
import { VendorProductsController } from './vendor-products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseModule } from 'src/microservice/supabase/supabase.module';

@Module({
  controllers: [VendorProductsController],
  providers: [VendorProductsService],
  imports: [PrismaModule, SupabaseModule]
})
export class VendorProductsModule { }
