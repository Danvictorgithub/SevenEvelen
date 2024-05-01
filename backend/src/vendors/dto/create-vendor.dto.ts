import { IsOptional, Length } from "class-validator";

export class CreateVendorDto {
    @Length(1, 32)
    name: string;
    @IsOptional()
    @Length(1)
    image: string
}
