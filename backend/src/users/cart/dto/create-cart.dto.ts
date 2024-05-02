import { IsInt, IsOptional, Length, Min, Max } from "class-validator"

export class CreateCartDto {
    @IsInt()
    productId: number
    @IsInt()
    @Min(1)
    @Max(999)
    quantity: number
    @IsOptional()
    @IsInt()
    userId: number
}
