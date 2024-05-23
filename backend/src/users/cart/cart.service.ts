import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createCartDto: CreateCartDto) {
    const product = await this.prisma.product.findUnique({ where: { id: createCartDto.productId } });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    const user = await this.prisma.user.findUnique({ where: { id: createCartDto.userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const userCartItem = await this.prisma.cartItem.findUnique({ where: { userId_productId: { productId: createCartDto.productId, userId: createCartDto.userId } } });
    if (userCartItem) {
      if (createCartDto.quantity > product.stock) {
        throw new BadRequestException("Quantity exceeds stock")
      }
      return await this.prisma.cartItem.update({
        where: { userId_productId: { productId: createCartDto.productId, userId: createCartDto.userId } },
        data: { quantity: createCartDto.quantity + userCartItem.quantity }
      });
    }
    if (createCartDto.quantity > product.stock) {
      throw new BadRequestException("Quantity exceeds stock")
    }
    return await this.prisma.cartItem.create({
      data: createCartDto
    });
  }

  async findAll(userId: number) {
    return this.prisma.cartItem.findMany({ where: { userId }, include: { product: { include: { product: true } } } });
  }
  async countAll(userId: number) {
    const count = (await this.prisma.cartItem.aggregate({ where: { userId }, _sum: { quantity: true } }))._sum.quantity;
    if (!count) {
      return 0;
    }
    return count;
  }
  async findOne(id: number, userId: number) {
    const cartItem = await this.prisma.cartItem.findUnique({ where: { id, userId } });
    if (!cartItem) {
      throw new NotFoundException("Cart item not found");
    }
    return cartItem;
  }

  async update(id: number, updateCartDto: UpdateCartDto, userId: number) {
    const cartItem = await this.prisma.cartItem.findUnique({ where: { id, userId } });
    if (!cartItem) {
      throw new NotFoundException("Cart item not found");
    }
    if (updateCartDto.productId) {
      const product = await this.prisma.product.findUnique({ where: { id: updateCartDto.productId } });
      if (!product) {
        throw new NotFoundException("Product not found");
      }
    }
    if (updateCartDto.userId) {
      const user = await this.prisma.user.findUnique({ where: { id: updateCartDto.userId } });
      if (!user) {
        throw new NotFoundException("User not found");
      }
    }
    if (updateCartDto.quantity) {
      const product = await this.prisma.product.findUnique({ where: { id: cartItem.productId } });
      if (updateCartDto.quantity > product.stock) {
        throw new BadRequestException("Quantity exceeds stock");
      }
    }
    return await this.prisma.cartItem.update({
      where: { id },
      data: updateCartDto
    });
  }

  async remove(id: number, userId: number) {
    const cartItem = await this.prisma.cartItem.findUnique({ where: { id } });
    if (!cartItem) {
      throw new NotFoundException("Cart item not found");
    }
    return this.prisma.cartItem.delete({ where: { id } });
  }
}
