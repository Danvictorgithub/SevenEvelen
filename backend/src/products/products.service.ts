import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createProductDto: CreateProductDto) {
    const store = await this.prisma.store.findUnique({ where: { id: createProductDto.storeId } });
    if (!store) {
      throw new NotFoundException("Store not found");
    }
    const vendorProduct = await this.prisma.vendorProduct.findUnique({ where: { id: createProductDto.productId } });
    if (!vendorProduct) {
      throw new NotFoundException("VendorProduct not found");
    }
    const product = await this.prisma.product.findUnique({ where: { storeId_productId: { productId: createProductDto.productId, storeId: createProductDto.storeId } } });
    if (product) {
      throw new BadRequestException("Product already exists in this store");
    }
    return await this.prisma.product.create({
      data: createProductDto
    });
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }
  async newArrivals() {
    return this.prisma.product.findMany({ take: 10, orderBy: { updatedAt: "desc" } })
  }
  async trendingProducts() {
    const trendingProductSell = await this.prisma.transactionItem.groupBy({
      by: ['productId'],
      _count: {
        productId: true,
      },
      _max: {
        updatedAt: true,
      },
    });

    // Sorting the result in JavaScript
    const sortedResult = trendingProductSell
      .sort((a, b) => {
        // First sort by count of productId in descending order
        if (b._count.productId !== a._count.productId) {
          return b._count.productId - a._count.productId;
        }
        // If counts are equal, sort by updatedAt in descending order
        return new Date(b._max.updatedAt).getTime() - new Date(a._max.updatedAt).getTime();
      })
      .slice(0, 10); // Take the top 10
    const parsedResult = await this.prisma.product.findMany({ where: { id: { in: sortedResult.map(res => res.productId) } } })
    return parsedResult;
  }
  async mostBoughtProduct() {
    return await this.prisma.product.findMany({ where: { id: { in: (await this.prisma.transactionItem.groupBy({ by: 'productId', take: 10, _count: { productId: true }, orderBy: { _count: { productId: 'desc' } } })).map(res => res.productId) } } });
  }
  async randomProduct() { //Randomly choose a product Daily using Today Date String Hash
    // return await this.prisma.product.findFirst({ skip: Math.random() * (await this.prisma.product.count() + 1) });
    // Get the current date in YYYYMMDD format
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    // Use the date string to create a simple hash
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      const char = today.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    // Get the total number of products
    const productCount = await this.prisma.product.count();

    // Ensure the hash is non-negative and within the product count range
    const randomIndex = Math.abs(hash) % productCount;

    // Fetch and return the random product
    const randomProduct = await this.prisma.product.findFirst({ skip: randomIndex, include: { store: true } });
    const randomProductNoCart = await this.prisma.cartItem.count({ where: { productId: randomProduct.id } });
    return { ...randomProduct, userCart: randomProductNoCart };
  }
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    if (updateProductDto.storeId) {
      const productExist = await this.prisma.product.findUnique({ where: { storeId_productId: { productId: product.productId, storeId: updateProductDto.storeId } } });
      if (productExist) {
        throw new BadRequestException("Product already exists in this store");
      }
    }
    if (updateProductDto.productId) {
      const productExist = await this.prisma.product.findUnique({ where: { storeId_productId: { productId: updateProductDto.productId, storeId: product.storeId } } });
      if (productExist) {
        throw new BadRequestException("Product already exists in this store");
      }
    }
    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto
    });
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return this.prisma.product.delete({ where: { id } });
  }
}
