import { IsIn, IsInt, IsObject, IsOptional, Length } from "class-validator";

export class CreateCartItemDto {
    @IsInt()
    productId: number
    @IsInt()
    @Length(1, 999)
    quantity: number
    @IsInt()
    userId: number
}
