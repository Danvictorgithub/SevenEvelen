import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/microservice/supabase/supabase.service';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService, private readonly supabase: SupabaseService) { }
  async create(createBrandDto: CreateBrandDto, image: Express.Multer.File) {
    const brand = await this.prisma.brand.findUnique({ where: { name: createBrandDto.name } });
    if (brand) {
      throw new BadRequestException("Brand already exist");
    }
    if (image) {
      const imageLink = await this.supabase.uploadImage(image);
      createBrandDto.image = imageLink;
    }
    return this.prisma.brand.create({ data: createBrandDto });
  }

  async findAll() {
    return await this.prisma.brand.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.brand.findUnique({ where: { id } });
  }

  async update(id: number, updateBrandDto: UpdateBrandDto, image: Express.Multer.File) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) {
      throw new NotFoundException("Brand not found");
    }
    if (image) {
      const isSupabaseUrl = this.supabase.isSupabaseUrl(brand.image);
      if (isSupabaseUrl) {
        const fileName = this.supabase.getFilenameFromSupabaseUrl(brand.image);
        await this.supabase.deleteImage(fileName);
      }
      updateBrandDto.image = await this.supabase.uploadImage(image);
    }
    if (updateBrandDto.name) {
      const brandExist = await this.prisma.brand.findUnique({ where: { name: updateBrandDto.name } });
      if (brandExist) {
        throw new BadRequestException("Brand already exist");
      }
    }
    return await this.prisma.brand.update({ where: { id }, data: updateBrandDto });
  }

  async remove(id: number) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) {
      throw new NotFoundException("Brand not found");
    }
    const isSupabaseUrl = this.supabase.isSupabaseUrl(brand.image);
    if (isSupabaseUrl) {
      const fileName = this.supabase.getFilenameFromSupabaseUrl(brand.image);
      console.log(fileName)
      await this.supabase.deleteImage(fileName);
    }
    return await this.prisma.brand.delete({ where: { id } });
  }
}
