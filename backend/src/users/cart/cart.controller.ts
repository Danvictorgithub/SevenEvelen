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
@Controller('users/cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createCartDto: CreateCartDto, @Request() req: RequestUser) {
    createCartDto.userId = req.user.id;
    return this.cartService.create(createCartDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req: RequestUser) {
    return this.cartService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestUser) {
    return this.cartService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto, @Request() req: RequestUser) {
    updateCartDto.userId = req.user.id;
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id',)
  remove(@Param('id') id: string, @Request() req: RequestUser) {
    return this.cartService.remove(+id, req.user.id);
  }
}
