import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, BadRequestException, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, FileValidator, MaxFileSizeValidator } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  // @UseInterceptors(FileInterceptor('image'))
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createCategoryDto: CreateCategoryDto,
    // @UploadedFile(new ParseFilePipe({ fileIsRequired: false, validators: [new FileTypeValidator({ fileType: "image/*" }), new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })], })) image: Express.Multer.File
  ) {
    return this.categoryService.create(createCategoryDto);
  }
  @Get('all')
  findAllOriginal() {
    return this.categoryService.findAllOriginal();
  }
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe({ skipUndefinedProperties: true, whitelist: true, forbidNonWhitelisted: true })) updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
