import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Length, MinLength } from "class-validator";

export class CreateVendorDto {
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    userId: number;
    @IsString()
    @Length(1, 32)
    name: string
    @IsOptional()
    @IsString()
    image: string;
}
