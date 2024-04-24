import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { IsOptional, Length } from 'class-validator';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
    @IsOptional()
    @Length(1)
    name: string;
}
