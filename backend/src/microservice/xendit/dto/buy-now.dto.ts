import { IsInt, Min } from "class-validator";

export class BuyNowDto {
    @IsInt()
    productId: number;
    @IsInt()
    @Min(1)
    quantity: number
}