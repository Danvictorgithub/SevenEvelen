import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartItemsService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createCartItemDto: CreateCartItemDto) {
    const userCartItem = await this.prisma.cartItem.findUnique({ where: { userId_productId: { productId: createCartItemDto.productId, userId: createCartItemDto.userId } } });
    if (userCartItem) {
      return await this.prisma.cartItem.update({
        where: { userId_productId: { productId: createCartItemDto.productId, userId: createCartItemDto.userId } },
        data: { quantity: createCartItemDto.quantity + userCartItem.quantity }
      });
    }
    return await this.prisma.cartItem.create({
      data: createCartItemDto
    });
  }

  async findAll() {
    return this.prisma.cartItem.findMany();
  }

  async findOne(id: number) {
    const cartItem = await this.prisma.cartItem.findUnique({ where: { id } });
    if (!cartItem) {
      throw new NotFoundException("Cart item not found");
    }
    return cartItem;
  }

  async update(id: number, updateCartItemDto: UpdateCartItemDto) {
    const cartItem = await this.prisma.cartItem.findUnique({ where: { id } });
    if (!cartItem) {
      throw new NotFoundException("Cart item not found");
    }
    return await this.prisma.cartItem.update({
      where: { id },
      data: updateCartItemDto
    });
  }

  async remove(id: number) {
    const cartItem = await this.prisma.cartItem.findUnique({ where: { id } });
    if (!cartItem) {
      throw new NotFoundException("Cart item not found");
    }
    return this.prisma.cartItem.delete({ where: { id } });
  }
}
