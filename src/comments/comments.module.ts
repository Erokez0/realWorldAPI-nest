import { Module } from '@nestjs/common'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { CommonModule } from 'src/common/common.module'
import { UsersService } from 'src/users/users.service'

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [CommentsController],
  providers: [CommentsService, UsersService],
})
export class CommentsModule {}
