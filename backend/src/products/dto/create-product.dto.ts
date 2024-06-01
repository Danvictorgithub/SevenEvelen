import { IsInt, IsNumber, IsOptional } from "class-validator";

export class CreateProductDto {
    @IsInt()
    productId: number;
    @IsNumber()
    markupRate: number;
    @IsInt()
    @IsOptional()
    stock: number;
    @IsInt()
    storeId: number;
}
