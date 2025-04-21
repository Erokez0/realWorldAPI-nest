import { ApiHideProperty, ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'

import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator'
import { CreateUserDto } from './create-user.dto'
import { Optional } from '@nestjs/common'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  image?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bio?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  password?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username?: string

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiHideProperty()
  @ApiPropertyOptional({readOnly: true})
  @Optional()
  token?: string
}