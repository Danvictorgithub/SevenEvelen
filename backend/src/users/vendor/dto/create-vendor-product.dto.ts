import { Type } from "class-transformer";
import { IsIn, IsInt, IsNumber, IsObject, IsOptional, IsString, Length } from "class-validator";

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
    @IsInt()
    @Type(() => Number)
    originalPrice: number;
    @IsInt()
    @Type(() => Number)
    brandId: number;
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    vendorId: number;
    @IsInt()
    @Type(() => Number)
    productTypeId: number
}
