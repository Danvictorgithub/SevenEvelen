import { IsNotEmpty } from "class-validator";

export class DeleteVendorProductDto {
    @IsNotEmpty()
    products: Array<number>
}