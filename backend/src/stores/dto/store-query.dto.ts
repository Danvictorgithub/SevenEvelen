import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class StoreQuery {
    @IsString()
    name: string;
    @IsInt()
    @Type(() => Number)
    take: number;
    @IsInt()
    @Type(() => Number)
    skip: number;
}