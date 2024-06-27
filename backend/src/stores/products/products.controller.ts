import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/authentication/auth/jwt.auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Role, Roles } from 'src/enums/roles.enum';
import { StoreIdExistGuard } from 'src/guards/store-id-exist/store-id-exist.guard';

@Controller('/stores/:storeId/products')
@UseGuards(JwtAuthGuard, RolesGuard, StoreIdExistGuard)
@Roles(Role.Admin)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // @Post()
  // create(@Body() createProductDto: CreateProductDto) {
  //   return this.productsService.create(createProductDto);
  // }

  @Get()
  findAll(@Param('storeId', new ParseIntPipe()) storeId: number) {
    return this.productsService.findAll(storeId);
  }

  @Get(':id')
  findOne(@Param('storeId', new ParseIntPipe()) storeId: number, @Param('id') id: string) {
    return this.productsService.findOne(+id, storeId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }

  @Delete(':id')
  remove(@Param('storeId', new ParseIntPipe()) storeId: number, @Param('id') id: string) {
    return this.productsService.remove(+id, storeId);
  }
}
