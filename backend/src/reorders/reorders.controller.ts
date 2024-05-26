import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { ReordersService } from './reorders.service';
import { CreateReorderDto } from './dto/create-reorder.dto';
import { UpdateReorderDto } from './dto/update-reorder.dto';

@Controller('reorders')
export class ReordersController {
  constructor(private readonly reordersService: ReordersService) { }

  @Post()
  create(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createReorderDto: CreateReorderDto) {
    return this.reordersService.create(createReorderDto);
  }

  @Get()
  findAll() {
    return this.reordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReorderDto: UpdateReorderDto) {
    return this.reordersService.update(+id, updateReorderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reordersService.remove(+id);
  }
}
