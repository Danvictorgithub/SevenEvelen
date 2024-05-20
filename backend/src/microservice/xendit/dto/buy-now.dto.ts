import { IsInt, Min } from "class-validator";

export class BuyNowDto {
    @IsInt()
    productId: number;
    @IsInt()
    @Min(0)
    quantity: number
}