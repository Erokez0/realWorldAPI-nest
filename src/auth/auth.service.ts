import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { SignInDto } from './dto/sign-in.dto'
import { JwtService } from '@nestjs/jwt'
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn({ password, email }: SignInDto) {
    const user = await this.usersService.findUserByEmail(email)
    if (user?.password !== password) {
      throw new UnauthorizedException()
    }
    const payload = { userId: user.id }
    const token = await this.jwtService.signAsync(payload)
    console.log(token)
    return await this.usersService.update(user.id, { token: token })
  }
}
