import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export type ReqUser = {
  userId: number
  iat: number
  exp: number
}

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): ReqUser => {
    return ctx.switchToHttp().getRequest().user
  },
)
