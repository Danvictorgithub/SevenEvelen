import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, ValidationPipe } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createVendorDto: CreateVendorDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false, validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), new FileTypeValidator({ fileType: "image/*" })] })) image: Express.Multer.File
  ) {
    return this.vendorsService.create(createVendorDto, image);
  }

  @Get()
  findAll() {
    return this.vendorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body(new ValidationPipe({ skipUndefinedProperties: true, whitelist: true, forbidNonWhitelisted: true })) updateVendorDto: UpdateVendorDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false, validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), new FileTypeValidator({ fileType: "image/*" })] })) image: Express.Multer.File) {
    return this.vendorsService.update(+id, updateVendorDto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(+id);
  }
}
