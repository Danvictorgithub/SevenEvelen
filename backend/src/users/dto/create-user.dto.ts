import { IsEmail, IsEnum, IsPhoneNumber, Length, buildMessage } from "class-validator";

enum userStatus {
    Admin = "Admin",
    Customer = "Customer",
    Vendor = "Vendor"
}
export class CreateUserDto {
    @IsEmail()
    email: string;
    @Length(1)
    firstName: string;
    @Length(1)
    lastName: string;
    // @IsPhoneNumber("PH")
    // phoneNumber: string;
    @Length(6)
    password: string
    @IsEnum(userStatus)
    status: userStatus
}
