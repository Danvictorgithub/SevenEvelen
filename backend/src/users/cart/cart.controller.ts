import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/authentication/auth/jwt.auth.guard';

export interface RequestUser extends Request {
  user: {
    id: number,
    email: string,
    type: string,
  }
}
@Controller('user_cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()

  create(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createCartDto: CreateCartDto, @Request() req: RequestUser) {
    createCartDto.userId = req.user.id;
    return this.cartService.create(createCartDto);
  }

  @Get()
  findAll(@Request() req: RequestUser) {
    return this.cartService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestUser) {
    return this.cartService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipUndefinedProperties: true })) updateCartDto: UpdateCartDto, @Request() req: RequestUser) {
    updateCartDto.userId = req.user.id;
    return this.cartService.update(+id, updateCartDto, req.user.id);
  }

  @Delete(':id',)
  remove(@Param('id') id: string, @Request() req: RequestUser) {
    return this.cartService.remove(+id, req.user.id);
  }
}
