import { IsInt } from "class-validator";

export class BuyNowDto {
    @IsInt()
    productId: number;
    @IsInt()
    quantity: number
}