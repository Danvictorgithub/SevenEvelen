import { Type } from "class-transformer";
import { IsEnum, IsInt, IsString } from "class-validator";

export enum ReorderStatus {
    'Pending' = 'Pending',
    'Approved' = 'Approved',
    'Rejected' = 'Rejected',
    'Delivered' = 'Delivered'
}

export class ReorderQuery {
    @IsInt()
    @Type(() => Number)
    take: number

    @IsInt()
    @Type(() => Number)
    skip: number

    @IsEnum(ReorderStatus)
    status: ReorderStatus
    @IsString()
    orderBy: 'asc' | 'desc'
} 