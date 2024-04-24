import { IsInt, IsOptional, Length } from "class-validator";

export class CreateCategoryDto {
    @Length(1)
    name: string
    @IsOptional()
    @IsInt()
    productTypeParentId: number
}
