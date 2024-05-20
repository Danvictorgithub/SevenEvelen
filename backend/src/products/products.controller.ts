import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(@Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true })) createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
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
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true })) updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
