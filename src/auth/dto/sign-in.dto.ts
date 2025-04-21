import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"


export class SignInDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @MinLength(6)
    @ApiProperty()
    password: string;
}