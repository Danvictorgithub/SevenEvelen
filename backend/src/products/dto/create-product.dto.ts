import { IsInt, IsNumber } from "class-validator";

export class CreateProductDto {
    @IsInt()
    productId: number;
    @IsNumber()
    markupRate: number;
    @IsInt()
    stock: number;
    @IsInt()
    storeId: number;
}
