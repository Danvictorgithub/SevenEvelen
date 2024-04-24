import { IsEmail, IsPhoneNumber, Length, buildMessage } from "class-validator";

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
}
