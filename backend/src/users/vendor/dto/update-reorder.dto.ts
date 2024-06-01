import { ReorderStatus } from "@prisma/client";
import { IsDate, IsDateString, IsEnum } from "class-validator";

export class UpdateReorderDto {
    @IsEnum(ReorderStatus)
    status: ReorderStatus
    @IsDateString()
    deliveryDate: Date
}