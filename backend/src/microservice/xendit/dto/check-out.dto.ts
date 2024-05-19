import { ArrayNotEmpty, IsArray } from "class-validator";

export class CheckOutDto {
    @ArrayNotEmpty()
    products: Array<number>
}