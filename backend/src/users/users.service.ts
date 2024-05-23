import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createUserDto: CreateUserDto) {
    const userExist = await this.prisma.user.findUnique({ where: { email: createUserDto.email.toLowerCase() } });
    if (userExist) {
      throw new BadRequestException("User Already Exist");
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, parseInt(process.env.SECRET_KEY));
    createUserDto.email = createUserDto.email.toLowerCase();
    return this.prisma.user.create({ data: createUserDto });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }
  async findInfo(userId: number) {
    return await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, firstName: true, lastName: true, status: true } });
  }
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException("User not found");
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      updateUserDto.email = updateUserDto.email.toLowerCase();
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, parseInt(process.env.SECRET_KEY));
    }
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException("User not found");
    }
    return this.prisma.user.delete({ where: { id } });
  }
}
