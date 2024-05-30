import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductType } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.productType.findUnique({ where: { name: createCategoryDto.name } });
    if (category) {
      throw new BadRequestException("Category already exist");
    }
    if (createCategoryDto.productTypeParentId) {
      const parentCategory = await this.prisma.productType.findUnique({ where: { id: createCategoryDto.productTypeParentId } });
      if (!parentCategory) {
        throw new NotFoundException("Parent Category does not exist");
      }
    }
    return this.prisma.productType.create({ data: createCategoryDto });
  }

  private async fetchCategory(category) {
    const children = await this.prisma.productType.findMany({ where: { productTypeParentId: category.id } });
    return {
      ...category,
      productTypes: await Promise.all(children.map(child => this.fetchCategory(child))),
    };
  }
  async findAllOriginal() {
    return await this.prisma.productType.findMany();
  }
  async findAll() {
    const categories = await this.prisma.productType.findMany({ where: { productTypeParentId: null } });
    return Promise.all(categories.map(category => this.fetchCategory(category)));
  }
  private async fetchParentCategory(category: ProductType) {
    if (category.productTypeParentId) {
      const parent = await this.prisma.productType.findUnique({ where: { id: category.productTypeParentId } });
      return { ...category, productTypes: parent }
    }
    return category;
  }
  async findOne(id: number) {
    const category = await this.prisma.productType.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException("Category does not exist");
    }
    return this.fetchParentCategory(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.productType.findUnique({ where: { id } });
    if (!category) {
      throw new BadRequestException("Category does not exist");
    }
    if (updateCategoryDto.productTypeParentId) {
      const parentCategory = await this.prisma.productType.findUnique({ where: { id: updateCategoryDto.productTypeParentId } });
      if (!parentCategory) {
        throw new NotFoundException("Parent Category does not exist");
      }
    }
    if (updateCategoryDto.name) {
      const categoryExist = await this.prisma.productType.findUnique({ where: { name: updateCategoryDto.name } });
      if (categoryExist) {
        throw new BadRequestException("Category already exist");
      }
    }
    return this.prisma.productType.update({ where: { id }, data: updateCategoryDto });
  }

  async remove(id: number) {
    const category = await this.prisma.productType.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException("Category does not exist");
    }
    return await this.prisma.productType.delete({ where: { id } });
  }
}
