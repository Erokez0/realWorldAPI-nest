import { NestFactory, Reflector, HttpAdapterHost } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import {
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common'
import { AppModule } from './app.module'
import { AppValidationPipe } from './app.validation.pipe'
import { PrismaExceptionFilter } from './prisma/exception-filter.filter'
import { CreateUserDto } from './users/dto/create-user.dto'
import { SignInDto } from './auth/dto/sign-in.dto'
import { CreateArticleDto } from './articles/dto/create-article.dto'
import { ArticleEntity } from './articles/entities/article.entity'
import { User } from './common/decorators/user.decorator'
import { UserEntity } from './users/entities/user.entity'
import { UpdateUserDto } from './users/dto/update-user.dto'
import { CommentEntity } from './comments/entities/comment.entity'
import { ProfileEntity } from './users/entities/profile.entity'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('/api')

  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(new AppValidationPipe())
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter))

  const config = new DocumentBuilder()
    .addBearerAuth({
      description: "JWT token",
      name: "Authorization",
      bearerFormat: "Token",
      scheme: "bearer",
      type: "http",
      in: "header"
    }, "Token")
    // .addSecurityRequirements('Token')
    .setTitle('RealWorld API')
    .setVersion('1.0')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config, {
    extraModels: [
      CreateUserDto,
      SignInDto,
      CreateArticleDto,
      ArticleEntity,
      UserEntity,
      UpdateUserDto,
      CommentEntity,
      ProfileEntity
    ]
  },)
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })

  // app.enableCors({
  //   origin: true,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: [
  //     'Authorization', // 👈 Explicitly allow Authorization header
  //     'Content-Type',
  //   ],
  //   exposedHeaders: ['Authorization'], // 👈 Expose to browser
  //   hiddenHeaders: ['x-powered-by'],
  // });

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
