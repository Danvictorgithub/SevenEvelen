import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { SupabaseModule } from 'src/microservice/supabase/supabase.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [VendorsController],
  providers: [VendorsService],
  imports: [SupabaseModule, PrismaModule]
})
export class VendorsModule { }
