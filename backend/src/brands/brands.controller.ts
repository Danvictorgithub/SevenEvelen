import { Controller, Get, Post, Body, Patch, Param, Delete, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }

  @Post()
  @Roles()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createBrandDto: CreateBrandDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false, validators: [new FileTypeValidator({ fileType: "image/*" }), new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })], })) image: Express.Multer.File
  ) {
    return this.brandsService.create(createBrandDto, image);
  }

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ skipUndefinedProperties: true, whitelist: true, forbidNonWhitelisted: true })) updateBrandDto: UpdateBrandDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false, validators: [new FileTypeValidator({ fileType: "image/*" }), new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })], })) image: Express.Multer.File
  ) {
    return this.brandsService.update(+id, updateBrandDto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }
}
