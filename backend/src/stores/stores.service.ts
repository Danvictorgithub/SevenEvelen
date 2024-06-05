import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/microservice/supabase/supabase.service';
import { StoreQuery } from './dto/store-query.dto';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService, private readonly supabase: SupabaseService) { }
  async create(createStoreDto: CreateStoreDto, image: Express.Multer.File) {
    if (image) {
      createStoreDto.image = await this.supabase.uploadImage(image);
    }
    return await this.prisma.store.create({ data: createStoreDto });
  }

  async findAll(query: StoreQuery) {
    if (query) {
      const { name, ...mainQuery } = query;
      mainQuery["where"] = { name: { contains: name, mode: "insensitive" } }
      return await this.prisma.store.findMany({ include: { _count: { select: { products: true } } }, ...mainQuery });
    }
    return await this.prisma.store.findMany({ include: { _count: { select: { products: true } } } });
  }
  async countAll(query: StoreQuery) {
    if (query) {
      const { name, ...mainQuery } = query;
      return await this.prisma.store.count({ where: { name: { contains: name, mode: "insensitive" } } });
    }
    return await this.prisma.store.count();
  }
  async findLocations() {
    return await this.prisma.store.findMany({ select: { lat: true, long: true } });
  }
  async findOne(id: number) {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store
  }

  async update(id: number, updateStoreDto: UpdateStoreDto, image: Express.Multer.File) {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    if (image) {
      updateStoreDto.image = await this.supabase.uploadImage(image);
      this.supabase.deleteImage(store.image)
    }
    return this.prisma.store.update({ where: { id }, data: updateStoreDto });
  }

  async remove(id: number) {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    this.supabase.deleteImage(store.image)
    return await this.prisma.store.delete({ where: { id } });
  }
}
