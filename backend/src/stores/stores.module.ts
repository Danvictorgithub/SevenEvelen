import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseModule } from 'src/microservice/supabase/supabase.module';

@Module({
  controllers: [StoresController],
  providers: [StoresService],
  imports: [PrismaModule, SupabaseModule]
})
export class StoresModule { }
