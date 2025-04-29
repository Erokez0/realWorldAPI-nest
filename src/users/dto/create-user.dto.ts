import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ minLength: 4 })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  username: string

  @ApiProperty({ description: 'Valid email' })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string
}
