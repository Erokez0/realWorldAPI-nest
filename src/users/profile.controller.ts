import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { ReqUser, User } from 'src/common/decorators/user.decorator'
import { ProfileEntity, ProfileResponseSchema } from './entities/profile.entity'
import { Key } from 'src/common/decorators/key.decorator'
import { RequestResponseInterceptor } from 'src/common/interceptors/request-response.interceptor'
import { AuthGuard } from 'src/auth/auth.guard'

@Controller('profiles')
export class ProfileController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse(ProfileResponseSchema)
  @UseInterceptors(RequestResponseInterceptor)
  @Key('profile')
  @Get(':username')
  @ApiBearerAuth('Token')
  async findOne(@Param('username') username: string, @User() user: ReqUser) {
    const profile = await this.usersService.findProfile(username)
    const isFollowing = user
      ? this.usersService.isFollowing(user.userId, profile.id)
      : false
    return new ProfileEntity(profile, isFollowing)
  }

  @Post(':username/follow')
  @ApiResponse({ status: 200, ...ProfileResponseSchema })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UseInterceptors(RequestResponseInterceptor)
  @ApiBearerAuth('Token')
  @Key('profile')
  async follow(@Param('username') username: string, @User() user: ReqUser) {
    return new ProfileEntity(
      await this.usersService.follow(username, user.userId),
      true,
    )
  }

  @Delete(':username/follow')
  @ApiOkResponse(ProfileResponseSchema)
  @UseGuards(AuthGuard)
  @UseInterceptors(RequestResponseInterceptor)
  @Key('profile')
  @ApiBearerAuth('Token')
  async unfollow(@Param('username') username: string, @User() user: ReqUser) {
    return new ProfileEntity(
      await this.usersService.unfollow(username, user.userId),
      false,
    )
  }
}
