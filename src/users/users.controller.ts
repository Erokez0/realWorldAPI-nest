import { Controller, Get, Post, Body, Put, UseInterceptors, UseGuards, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserCreateSchema, UserEntity, UserResponseSchema, UserUpdateSchema } from './entities/user.entity'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import { RequestResponseInterceptor } from 'src/common/interceptors/request-response.interceptor'
import { Key } from 'src/common/decorators/key.decorator'
import { AuthGuard } from 'src/auth/auth.guard'
import { ReqUser, User } from 'src/common/decorators/user.decorator'


@Controller()
@UseInterceptors(RequestResponseInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @ApiCreatedResponse(UserResponseSchema)
  @Post('users')
  @Key('user')
  @ApiBody(UserCreateSchema)
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @UseGuards(AuthGuard)
  @Get('user')
  @Key('user')
  @ApiOkResponse(UserResponseSchema)
  @ApiBearerAuth("Token")
  async findOne(@User() user: ReqUser) {
    return new UserEntity(await this.usersService.findUserById(user.userId));
  }

  @ApiOkResponse(UserResponseSchema)
  @Key('user')
  @Put('user')
  @UseGuards(AuthGuard)
  @ApiBody(UserUpdateSchema)
  @ApiBearerAuth("Token")
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: ReqUser) {
    return new UserEntity(await this.usersService.update(user.userId, updateUserDto));
  }
}
