import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { map, Observable } from 'rxjs'

@Injectable()
export class RequestResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  // biome-ignore lint/suspicious/noExplicitAny: It is supposed to be any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const key = this.reflector.getAllAndOverride('key', [
      context.getClass(),
      context.getHandler(),
    ])
    const meta = this.reflector.getAllAndOverride('meta', [
      context.getClass(),
      context.getHandler(),
    ])
    const request = context.switchToHttp().getRequest()
    if (request.body) {
      request.body = request.body[key]
    }

    return next.handle().pipe(
      map((data) => {
        const response = {
          [key]: data,
        }
        if (meta) {
          const [metaType, metaName] = meta
          switch (metaType) {
            case 'count':
              response[metaName] = data.length
              break
          }
        }
        return response
      }),
    )
  }
}
