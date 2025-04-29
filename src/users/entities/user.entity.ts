import { ApiHideProperty, ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { Exclude } from 'class-transformer'
import { ReqUser } from 'src/common/decorators/user.decorator'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'

export class UserEntity {
  @ApiProperty()
  email: string

  @ApiProperty()
  token: string | undefined

  @ApiProperty()
  username: string

  @ApiProperty()
  bio: string

  @ApiProperty()
  image: string | null

  @ApiHideProperty()
  @Exclude()
  password: string

  @ApiHideProperty()
  @Exclude()
  id: number

  constructor(userData: Partial<User>) {
    Object.assign(this, userData)
  }
}

export const UserCreateSchema = {
  schema: {
    type: 'object',
    properties: {
      user: {
        $ref: getSchemaPath(CreateUserDto),
      },
    },
  },
}

export const UserResponseSchema = {
  schema: {
    properties: {
      user: {
        $ref: getSchemaPath(UserEntity),
      },
    },
  },
}

export const UserUpdateSchema = {
  schema: {
    type: 'object',
    properties: {
      user: {
        $ref: getSchemaPath(UpdateUserDto),
      },
    },
  },
}
