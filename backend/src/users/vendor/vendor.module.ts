import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseModule } from 'src/microservice/supabase/supabase.module';

@Module({
  controllers: [VendorController],
  providers: [VendorService],
  imports: [PrismaModule, SupabaseModule]
})
export class VendorModule { }
