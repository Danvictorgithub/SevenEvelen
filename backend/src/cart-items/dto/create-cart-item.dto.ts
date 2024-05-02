import { IsIn, IsInt, IsObject, IsOptional, Length, Max, Min } from "class-validator";

export class CreateCartItemDto {
    @IsInt()
    productId: number
    @IsInt()
    @Min(1)
    @Max(999)
    quantity: number
    @IsInt()
    userId: number
}
