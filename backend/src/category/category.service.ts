import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
        throw new BadRequestException("Parent Category does not exist");
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

  async findAll() {
    const categories = await this.prisma.productType.findMany({ where: { productTypeParentId: null } });
    return Promise.all(categories.map(category => this.fetchCategory(category)));
  }

  async findOne(id: number) {
    return await this.prisma.productType.findUnique({ where: { id } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.productType.findUnique({ where: { id } });
    if (!category) {
      throw new BadRequestException("Category does not exist");
    }
    if (updateCategoryDto.productTypeParentId) {
      const parentCategory = await this.prisma.productType.findUnique({ where: { id: updateCategoryDto.productTypeParentId } });
      if (!parentCategory) {
        throw new BadRequestException("Parent Category does not exist");
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
      throw new BadRequestException("Category does not exist");
    }
    return await this.prisma.productType.delete({ where: { id } });
  }
}
