import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseFilePipe, UseInterceptors, UploadedFile, MaxFileSizeValidator, FileTypeValidator, ValidationPipe, Req, Query } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtAuthGuard } from 'src/authentication/auth/jwt.auth.guard';
import { Role, Roles } from 'src/enums/roles.enum';
import { RequestUser } from '../cart/cart.controller';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateVendorProductDto } from './dto/create-vendor-product.dto';
import { VendorProductQuery } from './dto/vendor-product-query';
import { DeleteVendorProductDto } from './dto/delete-vendor-product.dto';
import { ReorderQuery } from './dto/reorder-query.dto';
import { UpdateReorderDto } from './dto/update-reorder.dto';
import { RolesGuard } from 'src/guards/roles/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Vendor)
@Controller('user_vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) { }
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false, validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), new FileTypeValidator({ fileType: "image/*" })] })) image: Express.Multer.File,
    @Request() req: RequestUser, @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createVendorDto: CreateVendorDto) {
    createVendorDto.userId = req.user.id;
    return this.vendorService.create(createVendorDto, image);
  }

  @Get()
  findSelf(@Request() req: RequestUser) {
    return this.vendorService.findSelf(req.user.id);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('image'))
  update(@UploadedFile(new ParseFilePipe({ fileIsRequired: false, validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), new FileTypeValidator({ fileType: "image/*" })] })) image: Express.Multer.File, @Request() req: RequestUser, @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipUndefinedProperties: true })) updateVendorDto: UpdateVendorDto) {
    return this.vendorService.update(req.user.id, updateVendorDto, image);
  }
  @Get('stats')
  getStats(@Request() req: RequestUser) {

    return this.vendorService.getStats(req.user.id);
  }
  @Get('products/count')
  countallProducts(@Query(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipUndefinedProperties: true })) query: VendorProductQuery, @Request() req: RequestUser) {
    return this.vendorService.countAllProducts(req.user.id, query);
  }
  @Get('products')
  findAllProducts(@Query(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipUndefinedProperties: true })) query: VendorProductQuery, @Request() req: RequestUser) {
    return this.vendorService.findAllProducts(req.user.id, query)
  }
  @Get('')
  @Get('products/:id')
  findOneProduct(@Request() req: RequestUser, @Param('id') id: string) {
    return this.vendorService.findOneProduct(req.user.id, +id);
  }
  @Post('products')
  @UseInterceptors(FileInterceptor('image'))
  createVendorProduct(@Request() req: RequestUser, @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createVendorProductDto: CreateVendorProductDto, @UploadedFile(new ParseFilePipe({ fileIsRequired: false, validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), new FileTypeValidator({ fileType: "image/*" })] })) image: Express.Multer.File) {
    return this.vendorService.createVendorProduct(req.user.id, createVendorProductDto, image);
  }
  @Patch('products/:id')
  @UseInterceptors(FileInterceptor('image'))
  updateVendorProduct(@Param('id') id: string, @Request() req: RequestUser, @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipUndefinedProperties: true })) createVendorProductDto: CreateVendorProductDto, @UploadedFile(new ParseFilePipe({ fileIsRequired: false, validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), new FileTypeValidator({ fileType: "image/*" })] })) image: Express.Multer.File) {
    return this.vendorService.updateVendorProduct(req.user.id, createVendorProductDto, image, +id);
  }
  @Delete('products/')
  deleteSelectedProducts(@Request() req: RequestUser, @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) deleteVendorProductDto: DeleteVendorProductDto) {
    return this.vendorService.deleteSelectedProducts(req.user.id, deleteVendorProductDto);

  }
  @Delete('products/:id')
  deleteVendorProduct(@Param('id') id: string, @Request() req: RequestUser) {
    return this.vendorService.deleteVendorProduct(req.user.id, +id);
  }

  @Get('reorders')
  findAllReorders(@Request() req: RequestUser, @Query(new ValidationPipe({ whitelist: true, skipUndefinedProperties: true, forbidNonWhitelisted: true })) query: ReorderQuery) {
    return this.vendorService.findAllReorders(req.user.id, query);
  }
  @Get('reorders/count')
  countAllReorders(@Request() req: RequestUser, @Query(new ValidationPipe({ whitelist: true, skipUndefinedProperties: true, forbidNonWhitelisted: true })) query: ReorderQuery) {
    return this.vendorService.countAllReorders(req.user.id, query);
  }
  @Patch('reorders/:id')
  updateReorder(@Param('id') id: string, @Request() req: RequestUser, @Body(new ValidationPipe({ whitelist: true, skipUndefinedProperties: true, forbidNonWhitelisted: true })) updateReorderDto: UpdateReorderDto) {
    return this.vendorService.updateReorder(req.user.id, updateReorderDto, id);
  }
}
