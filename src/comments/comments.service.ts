import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { CommentEntity } from './entities/comment.entity'

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createCommentDto: CreateCommentDto,
    articleSlug: string,
    userId: number,
  ) {
    return await this.prismaService.comment.create({
      data: {
        ...createCommentDto,
        article: {
          connect: {
            slug: articleSlug,
          },
        },
        author: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        author: {
          select: {
            username: true,
            bio: true,
            image: true,
          },
        },
      },
    })
  }

  async findAll(slug: string) {
    return await this.prismaService.comment.findMany({
      where: {
        article: {
          slug,
        },
      },
      include: {
        author: {
          select: {
            username: true,
            bio: true,
            image: true,
          },
        },
      },
    })
  }
}
