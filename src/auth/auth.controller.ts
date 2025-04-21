import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { RequestResponseInterceptor } from 'src/common/interceptors/request-response.interceptor';
import { Key } from 'src/common/decorators/key.decorator';
import { UserEntity, UserResponseSchema } from 'src/users/entities/user.entity';
import { AuthSigninSchema } from './entities/auth.entity';
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiCreatedResponse(UserResponseSchema)
    @Post('users/login')
    @UseInterceptors(RequestResponseInterceptor)
    @Key('user')
    @ApiBody(AuthSigninSchema)
    async signIn(@Body() signInDto: SignInDto) {
        return new UserEntity(
            await this.authService.signIn(signInDto
            ));
    }

}
