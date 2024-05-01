import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './microservice/supabase/supabase.module';
import { AuthModule } from './authentication/auth/auth.module';
import { CategoryModule } from './category/category.module';
import { BrandsModule } from './brands/brands.module';
import { StoresModule } from './stores/stores.module';
import { VendorsModule } from './vendors/vendors.module';
import { VendorProductsModule } from './vendor-products/vendor-products.module';

@Module({
  imports: [UsersModule, PrismaModule, SupabaseModule, AuthModule, CategoryModule, BrandsModule, StoresModule, VendorsModule, VendorProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
