import { IsNumberString, IsOptional, IsString, Length } from "class-validator";

export class CreateStoreDto {
    @IsOptional()
    @IsString()
    @Length(1)
    image: string
    @Length(1, 32)
    name: string
    @Length(1, 128)
    address: string
    @Length(1, 32)
    opening_hours: string
    @IsOptional()
    @IsString()
    @IsNumberString()
    long: string;
    @IsOptional()
    @IsString()
    @IsNumberString()
    lat: string;
}
