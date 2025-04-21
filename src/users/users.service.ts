import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: createUserDto,
    })
  }

  findUserByEmail(email: string) {
    return this.prismaService.user.findUnique({ 
      where: {email},
    });
  }

  findUserById(id: number) {
    return this.prismaService.user.findUniqueOrThrow(
      { where: { id } }
    );
  }

  findProfile(username: string) {
    return this.prismaService.user.findUniqueOrThrow({
      where: { username },
      select: { id: true, username: true, bio: true, image: true },
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    })
  }

  isFollowing(followerId: number, followedId: number) {
    const followed = this.prismaService.user.findFirst({
      where: {
        id: followerId,
        following: {
          some: {
            id: followedId
          }
        }
      }
    })
    return !!followed
  }

  async follow(username: string,followerId: number) {
    return await this.prismaService.user.update({
      where: { username },
      data: {
        following: {
          connect: { id: followerId }
        }
      }
    })
  }

  async unfollow(username: string,followerId: number) {
    return await this.prismaService.user.update({
      where: { username },
      data: {
        following: {
          disconnect: { id: followerId }
        }
      }
    })
  }
}
