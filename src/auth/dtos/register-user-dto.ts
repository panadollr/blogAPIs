import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterUserDto{
    @ApiProperty()
    @IsNotEmpty({ message: 'Phone cannot be empty' })
    name: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty({ message: 'Email cannot be empty' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Password cannot be empty' })
    password: string;
}