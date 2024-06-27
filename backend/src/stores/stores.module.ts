import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseModule } from 'src/microservice/supabase/supabase.module';
import { ProductsModule } from './products/products.module';

@Module({
  controllers: [StoresController],
  providers: [StoresService],
  imports: [PrismaModule, SupabaseModule, ProductsModule]
})
export class StoresModule { }
