import { Type } from "class-transformer";
import { IsInt, IsNumberString, Min } from "class-validator";

export class transactionQueryDto {
    @Min(1)
    @IsInt()
    @Type(() => Number)
    take: number;
    @Min(1)
    @IsInt()
    @Type(() => Number)
    page: number;
}