import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email: string;
    @IsOptional()
    @Length(1)
    firstName: string;
    @IsOptional()
    @Length(1)
    lastName: string;
    // @IsPhoneNumber("PH")
    // phoneNumber: string;
    @IsOptional()
    @Length(6)
    password: string
}
