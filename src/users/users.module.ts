import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { ProfileController } from './profile.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { CommonModule } from 'src/common/common.module'
import { AuthGuard } from 'src/auth/auth.guard'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [UsersController, ProfileController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
