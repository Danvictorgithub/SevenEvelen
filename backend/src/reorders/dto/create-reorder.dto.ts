import { Prisma, PrismaClient } from "@prisma/client";
import { ArrayNotEmpty, IsInt, IsString } from "class-validator";

export class CreateReorderDto {
    @ArrayNotEmpty()
    products: Array<number>
    @IsInt()
    quantity: number
}

