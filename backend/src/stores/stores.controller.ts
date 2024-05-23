import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseInterceptors, UploadedFile, FileValidator, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createStoreDto: CreateStoreDto,
    @UploadedFile(new ParseFilePipe({
      fileIsRequired: false, validators: [new FileTypeValidator({ fileType: "image/*" }), new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })]
    })) image: Express.Multer.File
  ) {
    return this.storesService.create(createStoreDto, image);
  }

  @Get()
  findAll() {
    return this.storesService.findAll();
  }
  @Get('locations')
  findLocations() {
    return this.storesService.findLocations()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(+id);
  }
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ skipUndefinedProperties: true, whitelist: true, forbidNonWhitelisted: true })) updateStoreDto: UpdateStoreDto,
    @UploadedFile(new ParseFilePipe({
      fileIsRequired: false, validators: [new FileTypeValidator({ fileType: "image/*" }), new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })]
    })) image: Express.Multer.File
  ) {
    return this.storesService.update(+id, updateStoreDto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(+id);
  }
}
