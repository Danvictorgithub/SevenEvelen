import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class ProductsQuery {
    @Min(1)
    @IsInt()
    @Type(() => Number)
    skip: number;
    @Min(1)
    @IsInt()
    @Type(() => Number)
    take: number
}