import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/microservice/supabase/supabase.service';

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService, private readonly supabase: SupabaseService) { }
  async create(createVendorDto: CreateVendorDto, image: Express.Multer.File) {
    if (image) {
      createVendorDto.image = await this.supabase.uploadImage(image);
    }
    if (createVendorDto.userId) {
      const user = await this.prisma.user.findUnique({ where: { id: createVendorDto.userId } });
      if (!user) { throw new NotFoundException("User not found"); }
      if (user.status !== 'Vendor') {
        throw new NotFoundException("User is not a Vendor");
      }
      if (user.vendorId) {
        throw new NotFoundException("User is already a Vendor");
      }
    }
    return this.prisma.vendor.create({ data: createVendorDto });
  }

  async findAll() {
    return this.prisma.vendor.findMany();
  }

  async findOne(id: number) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id } }); if (!vendor) { throw new NotFoundException("Vendor not found"); }
    return vendor;
  }

  async update(id: number, updateVendorDto: UpdateVendorDto, image: Express.Multer.File) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id } }); if (!vendor) { throw new NotFoundException("Vendor not found"); }
    if (image) {
      updateVendorDto.image = await this.supabase.uploadImage(image);
      this.supabase.deleteImage(vendor.image);
    }
    return this.prisma.vendor.update({ where: { id }, data: updateVendorDto });
  }

  async remove(id: number) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id } }); if (!vendor) { throw new NotFoundException("Vendor not found"); }
    this.supabase.deleteImage(vendor.image)
    return this.prisma.vendor.delete({ where: { id } });
  }
}
