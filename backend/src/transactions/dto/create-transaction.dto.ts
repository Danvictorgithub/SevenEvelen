import { IsArray, IsNotEmpty, IsNumber, IsOptional, Length, Min } from "class-validator";

export class CreateTransactionDto {
    @IsNumber()
    userId: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    totalAmount: number;

    @IsArray()
    @IsNotEmpty()
    products: Array<number>;

}
