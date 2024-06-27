import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsQuery } from './dto/productsQuery.dto';
import { JwtAuthGuard } from 'src/authentication/auth/jwt.auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Role, Roles } from 'src/enums/roles.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  create(@Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true })) createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  @Get()
  findAll(@Query(new ValidationPipe({ skipUndefinedProperties: true, skipNullProperties: true, whitelist: true, forbidNonWhitelisted: true })) query: ProductsQuery) {
    return this.productsService.findAll(query);
  }
  @Get('count')
  countAll(@Query(new ValidationPipe({ skipUndefinedProperties: true, whitelist: true, forbidNonWhitelisted: true })) query: ProductsQuery) {
    return this.productsService.countAll(query);
  }
  @Get('newArrivals')
  newArrivals() {
    return this.productsService.newArrivals();
  }
  @Get('trendingProducts')
  trendingProducts() {
    return this.productsService.trendingProducts();
  }
  @Get('mostBoughtProducts')
  mostBoughtProducts() {
    return this.productsService.mostBoughtProduct()
  }
  @Get('randomProduct')
  randomProduct() {
    return this.productsService.randomProduct();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true })) updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
