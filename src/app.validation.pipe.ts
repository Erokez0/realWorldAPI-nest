import {
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common'

@Injectable()
export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      exceptionFactory: errors => {
        const exception = {
          errors: errors?.reduce((acc, error) => {
            Object.assign(acc, {
              [error.property]: Object.values(error.constraints!)
                .map(message => message.replace(/^(\w+\s)/g, ''))
            })
            return acc
          }, {})
        }
        console.log(exception)

        return new UnprocessableEntityException(exception)
      },
      enableDebugMessages: true
    })
  }
}
