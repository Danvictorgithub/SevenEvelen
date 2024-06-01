import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/microservice/supabase/supabase.service';
import { CreateVendorProductDto } from './dto/create-vendor-product.dto';
import { UpdateVendorProductDto } from './dto/update-vendor-product.dto';
import { VendorProductQuery } from './dto/vendor-product-query';
import { DeleteVendorProductDto } from './dto/delete-vendor-product.dto';
import { ReorderQuery } from './dto/reorder-query.dto';
import { UpdateReorderDto } from './dto/update-reorder.dto';

@Injectable()
export class VendorService {
  constructor(private readonly prisma: PrismaService, private readonly supabase: SupabaseService) { }
  async create(createVendorDto: CreateVendorDto, image: Express.Multer.File | null) {
    const user = await this.prisma.user.findUnique({ where: { id: createVendorDto.userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (user.vendor) {
      throw new BadRequestException("User is already a vendor");
    }
    if (image) {
      createVendorDto.image = await this.supabase.uploadImage(image);
    }
    const newVendor = await this.prisma.vendor.create({
      data: createVendorDto
    })
    return newVendor;
  }

  async findSelf(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new NotFoundException("Vendor doesn't have a profile");
    }
    return await this.prisma.vendor.findUnique({ where: { userId } });
  }


  async update(userId: number, updateVendorDto: UpdateVendorDto, image: Express.Multer.File) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) {
      throw new NotFoundException("Vendor not found")
    }
    if (image) {
      updateVendorDto.image = await this.supabase.uploadImage(image);
      this.supabase.deleteImage(vendor.image);
    }
    if (updateVendorDto.userId) {
      throw new UnauthorizedException();
    }
    const updatedVendor = await this.prisma.vendor.update({ where: { userId }, data: updateVendorDto })
    return updatedVendor;
  }
  async countAllProducts(userId: number, query: VendorProductQuery) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile");
    }
    if (query) {
      const { name, ...mainQuery } = query;
      if (name) {
        return await this.prisma.vendorProduct.count({ where: { vendorId: user.vendor.id, name: { contains: name, mode: 'insensitive' } } });
      }
      return await this.prisma.vendorProduct.count({ where: { vendorId: user.vendor.id } });
    }
    return await this.prisma.vendorProduct.count({ where: { vendorId: user.vendor.id } });
  }
  async findAllProducts(userId: number, query: VendorProductQuery) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile");
    }
    if (query) {
      const { name, ...mainQuery } = query;
      if (name) {
        return await this.prisma.vendorProduct.findMany({ where: { vendorId: user.vendor.id, name: { contains: name, mode: 'insensitive' } }, include: { brand: true, productType: true }, ...mainQuery });
      }
      return await this.prisma.vendorProduct.findMany({ where: { vendorId: user.vendor.id }, include: { brand: true, productType: true }, ...mainQuery });
    }
    const vendorProducts = await this.prisma.vendorProduct.findMany({ where: { vendorId: user.vendor.id }, include: { brand: true, productType: true } });
    return vendorProducts;
  }
  async findOneProduct(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile");
    }
    const vendorProduct = await this.prisma.vendorProduct.findUnique({ where: { vendorId: user.vendor.id, id } });
    if (!vendorProduct) {
      throw new NotFoundException("Vendor Product Not Found");
    }
    return vendorProduct;
  }
  async createVendorProduct(userId: number, createVendorProductDto: CreateVendorProductDto, image: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile");
    }
    createVendorProductDto.vendorId = user.vendor.id;
    if (image) {
      createVendorProductDto.image = await this.supabase.uploadImage(image);
    }
    const brand = await this.prisma.brand.findUnique({ where: { id: createVendorProductDto.brandId } });
    if (!brand) {
      throw new NotFoundException("Brand not found");
    }
    const category = await this.prisma.productType.findUnique({ where: { id: createVendorProductDto.productTypeId } });
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    const newVendorProduct = await this.prisma.vendorProduct.create({ data: createVendorProductDto });
    return newVendorProduct;
  }
  async updateVendorProduct(userId: number, updateVendorProductDto: UpdateVendorProductDto, image: Express.Multer.File, id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile");
    }
    updateVendorProductDto.vendorId = user.vendor.id;
    const vendorProduct = await this.prisma.vendorProduct.findUnique({ where: { vendorId: user.vendor.id, id } });
    if (!vendorProduct) {
      throw new NotFoundException("Vendor Product Not Found");
    }
    if (image) {
      updateVendorProductDto.image = await this.supabase.uploadImage(image);
      this.supabase.deleteImage(vendorProduct.image)
    }
    if (updateVendorProductDto.brandId) {
      const brand = await this.prisma.brand.findUnique({ where: { id: updateVendorProductDto.brandId } });
      if (!brand) {
        throw new NotFoundException("Brand not found");
      }
    }
    if (updateVendorProductDto.productTypeId) {
      const category = await this.prisma.productType.findUnique({ where: { id: updateVendorProductDto.productTypeId } });
      if (!category) {
        throw new NotFoundException("Category not found");
      }
    }
    const updatedVendorProduct = await this.prisma.vendorProduct.update({ where: { id }, data: updateVendorProductDto });
    return updatedVendorProduct;
  }

  async deleteSelectedProducts(userId: number, deleteVendorProductDto: DeleteVendorProductDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile")
    }
    const vendorProducts = await this.prisma.vendorProduct.findMany({ where: { id: { in: deleteVendorProductDto.products }, vendorId: user.vendor.id } });
    if (vendorProducts.length === 0) {
      throw new NotFoundException("Vendor Products Not Found");
    }
    return await this.prisma.vendorProduct.deleteMany({ where: { id: { in: deleteVendorProductDto.products } } });
  }
  async deleteVendorProduct(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile")
    }
    const vendorProduct = await this.prisma.vendorProduct.findUnique({ where: { id, vendorId: user.vendor.id } });
    if (!vendorProduct) {
      throw new NotFoundException("Vendor Product Not Found");
    }
    return await this.prisma.vendorProduct.delete({ where: { id: vendorProduct.id } });
  }

  async getStats(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile");
    }
    const noProducts = await this.prisma.vendorProduct.count({ where: { vendorId: user.vendor.id } });
    // const noAssociatedStores = (await this.prisma.product.aggregate({ where: { product: { vendorId: user.vendor.id } }, _count: { storeId: true } }))._count;
    const noAssociatedStores = (await this.prisma.product.groupBy({ by: 'storeId', where: { product: { vendorId: user.vendor.id } } })).length;
    const reorderItems = await this.prisma.reorderItems.findMany({ where: { reorder: { status: 'Delivered' }, product: { product: { vendorId: user.vendor.id } } }, select: { quantity: true, product: { select: { product: { select: { originalPrice: true } } } } } });
    const noItemsSold = reorderItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalProfit = reorderItems.reduce((acc, item) => acc + item.product.product.originalPrice * item.quantity, 0);
    const allReorders = await this.prisma.reorder.findMany({
      relationLoadStrategy: 'join', where: {
        vendorId: user.vendor.id,
      }, include: { reorderItems: { include: { product: { select: { product: { select: { originalPrice: true } } } } } } }
    });
    const weekProfit = allReorders.reduce((acc, item) => acc + ((item.status == 'Delivered') ? item.reorderItems.reduce((sum, reorderItem) => sum + reorderItem.quantity * reorderItem.product.product.originalPrice, 0) : 0), 0)
    const reordersThisWeek = allReorders.reduce((days, transaction) => {
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
      if (transaction.createdAt >= weekStart && transaction.createdAt <= weekEnd) {
        if (!days[transaction.createdAt.getDay()]) {
          days[transaction.createdAt.getDay()] = 0;
        }
        days[transaction.createdAt.getDay()] += transaction.reorderItems.reduce((acc, item) => acc + item.quantity * item.product.product.originalPrice, 0);
      }
      return days;
    }, {})

    return { noAssociatedStores, totalProfit, noProducts, noItemsSold, reordersThisWeek, weekProfit }
  }

  async findAllReorders(userId: number, query: ReorderQuery) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile");
    }
    if (query) {
      const { status, orderBy, ...mainQuery } = query;
      if (orderBy) {
        mainQuery['orderBy'] = { status: orderBy }
      }
      if (status) {
        return await this.prisma.reorder.findMany({ relationLoadStrategy: 'join', where: { vendorId: user.vendor.id, status: query.status }, ...mainQuery, include: { reorderItems: { include: { product: { include: { product: true } } } } } });
      }
      return await this.prisma.reorder.findMany({ relationLoadStrategy: 'join', where: { vendorId: user.vendor.id, status: query.status }, ...mainQuery, include: { reorderItems: { include: { product: { include: { product: true } } } } } });
    }
    return await this.prisma.reorder.findMany({ relationLoadStrategy: 'join', where: { vendorId: user.vendor.id }, orderBy: { status: 'asc' }, include: { reorderItems: { include: { product: { include: { product: true } } } } } });
  }
  async countAllReorders(userId: number, query: ReorderQuery) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile");
    }
    if (query) {
      const { status, ...mainQuery } = query;
      if (status) {
        return await this.prisma.reorder.count({ where: { vendorId: user.vendor.id, status: query.status } });
      }
    }
    return await this.prisma.reorder.count({ where: { vendorId: user.vendor.id } });
  }
  async updateReorder(userId: number, updateReorderDto: UpdateReorderDto, id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { vendor: true } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.vendor) {
      throw new BadRequestException("Vendor doesn't have a profile");
    }
    const reorder = await this.prisma.reorder.findUnique({ where: { vendorId: user.vendor.id, id } });
    if (!reorder) {
      throw new NotFoundException("Reorder not found");
    }
    if (reorder.status !== 'Pending') {
      throw new BadRequestException('Reorder status is not pending')
    }
    if (updateReorderDto.status == 'Rejected') {
      updateReorderDto.deliveryDate = null;
    }
    else if (updateReorderDto.status == 'Delivered') {
      throw new UnauthorizedException()
    }
    else if (updateReorderDto.status == 'Approved') {
      if (updateReorderDto.deliveryDate === null) {
        throw new BadRequestException('Delivery date is required')
      }
      else if (new Date(updateReorderDto.deliveryDate) < new Date(reorder.createdAt) && new Date(updateReorderDto.deliveryDate) <= new Date()) {
        throw new BadRequestException("Delivery date cannot be earlier than reorder date or today's date")
      }
    }
    const updatedReorder = await this.prisma.reorder.update({ where: { id }, data: updateReorderDto });
    return updatedReorder;
  }
}
