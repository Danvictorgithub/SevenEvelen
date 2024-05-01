import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreDto } from './create-store.dto';
import { IsOptional, Length } from 'class-validator';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
    // @IsOptional()
    // @Length(1, 32)
    // name: string
    // @IsOptional()
    // @Length(1, 32)
    // address: string
    // @Length(1, 32)
    // @IsOptional()
    // opening_hours: string
}
