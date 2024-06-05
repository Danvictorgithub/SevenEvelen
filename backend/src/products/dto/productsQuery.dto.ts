import { Type } from "class-transformer";
import { IsEnum, IsInt, IsString, Min, MinLength } from "class-validator";

export enum OrderBy {
    'asc' = 'asc',
    'desc' = 'desc',
}

export class ProductsQuery {
    @Min(0)
    @IsInt()
    @Type(() => Number)
    skip: number;
    @Min(1)
    @IsInt()
    @Type(() => Number)
    take: number
    @Min(0)
    @IsInt()
    @Type(() => Number)
    lte: number
    @Min(0)
    @IsInt()
    @Type(() => Number)
    gte: number
    @IsString()
    name: string
    @IsEnum(OrderBy)
    orderBy: string
    @Min(1)
    @IsInt()
    @Type(() => Number)
    productTypeId: number
    @IsInt()
    @Type(() => Number)
    storeId: number
}