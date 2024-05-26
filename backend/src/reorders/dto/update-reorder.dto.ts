import { PartialType } from '@nestjs/mapped-types';
import { CreateReorderDto } from './create-reorder.dto';
import { IsEnum } from 'class-validator';

enum ReorderStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected'

}

export class UpdateReorderDto extends PartialType(CreateReorderDto) {
    @IsEnum(ReorderStatus)
    status: ReorderStatus
}
