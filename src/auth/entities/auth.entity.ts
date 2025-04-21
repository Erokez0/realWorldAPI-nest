import { getSchemaPath } from '@nestjs/swagger';
import { SignInDto } from '../dto/sign-in.dto';

export const AuthSigninSchema = {
    schema: {
        properties: {
            user: {
                $ref: getSchemaPath(SignInDto)
            }
        }
    }
}