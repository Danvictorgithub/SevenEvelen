import { IsInt, IsNumber, IsObject, IsOptional, IsString, Length } from "class-validator";

export class CreateVendorProductDto {
    @IsString()
    @Length(1, 64)
    name: string;
    @IsOptional()
    @Length(1)
    image: string;
    @IsString()
    @Length(12, 12)
    upcCode: string;
    @IsString()
    @Length(1, 32)
    size: string
    @IsString()
    originalPrice: number;
    @IsString()
    brandId: number;
    @IsString()
    vendorId: number;
    @IsString()
    productTypeId: number
}
