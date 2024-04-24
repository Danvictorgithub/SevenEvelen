import { IsInt, IsOptional, Length } from "class-validator"

export class CreateBrandDto {
    @Length(1)
    name: string
    @IsOptional()
    @Length(1)
    image: string
}
