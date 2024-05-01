import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseInterceptors, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { VendorProductsService } from './vendor-products.service';
import { CreateVendorProductDto } from './dto/create-vendor-product.dto';
import { UpdateVendorProductDto } from './dto/update-vendor-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('vendor-products')
export class VendorProductsController {
  constructor(private readonly vendorProductsService: VendorProductsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createVendorProductDto: CreateVendorProductDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false, validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), new FileTypeValidator({ fileType: "image/*" })] })) image: Express.Multer.File
  ) {
    createVendorProductDto.brandId = Number(createVendorProductDto.brandId);
    createVendorProductDto.vendorId = Number(createVendorProductDto.vendorId);
    createVendorProductDto.productTypeId = Number(createVendorProductDto.productTypeId);
    createVendorProductDto.originalPrice = Number(createVendorProductDto.originalPrice);
    return this.vendorProductsService.create(createVendorProductDto, image);
  }

  @Get()
  findAll() {
    return this.vendorProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorProductsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body(new ValidationPipe({ skipUndefinedProperties: true, whitelist: true, forbidNonWhitelisted: true })) updateVendorProductDto: UpdateVendorProductDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false, validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), new FileTypeValidator({ fileType: "image/*" })] })) image: Express.Multer.File) {
    if (updateVendorProductDto.brandId) { updateVendorProductDto.brandId = Number(updateVendorProductDto.brandId); }
    if (updateVendorProductDto.vendorId) { updateVendorProductDto.vendorId = Number(updateVendorProductDto.vendorId); }
    if (updateVendorProductDto.productTypeId) { updateVendorProductDto.productTypeId = Number(updateVendorProductDto.productTypeId); }
    if (updateVendorProductDto.originalPrice) { updateVendorProductDto.originalPrice = Number(updateVendorProductDto.originalPrice); }
    return this.vendorProductsService.update(+id, updateVendorProductDto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorProductsService.remove(+id);
  }
}
