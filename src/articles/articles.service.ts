import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { LibService } from 'src/lib/lib.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'

@Injectable()
export class ArticlesService {
  constructor(
    private prismaService: PrismaService,
    private libService: LibService,
  ) {}

  async create(article: CreateArticleDto, authorId: number) {
    return this.prismaService.article.create({
      data: {
        ...article,
        slug: this.libService.generateSlug(article.title),
        author: {
          connect: {
            id: authorId,
          },
        },
        tagList: {
          connectOrCreate: article.tagList?.map((tagName) => ({
            where: {
              title: tagName,
            },
            create: {
              title: tagName,
            },
          })),
        },
      },
      include: {
        tagList: {
          select: {
            title: true,
          },
        },
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

  findAll({ tag, author, favoritedBy, limit, offset }) {
    const filterParams = {}

    if (tag) {
      filterParams['tagList'] = {
        some: {
          title: tag,
        },
      }
    }
    if (author) {
      filterParams['author'] = {
        username: author,
      }
    }
    if (favoritedBy) {
      filterParams['favoritedBy'] = {
        some: {
          username: favoritedBy,
        },
      }
    }

    const paginationParams = {
      skip: offset,
      take: limit,
    }
    return this.prismaService.article.findMany({
      where: filterParams,
      orderBy: { createdAt: 'desc' },
      include: {
        tagList: {
          select: { title: true },
          orderBy: { title: 'asc' },
        },
        author: {
          select: {
            username: true,
            bio: true,
            image: true,
          },
        },
      },
      ...paginationParams,
    })
  }

  findOne(slug: string) {
    return this.prismaService.article.findFirst({
      where: { slug },
      include: {
        tagList: { select: { title: true } },
        author: {
          select: { username: true, bio: true, image: true },
        },
        favoritedBy: { select: { id: true } },
      },
    })
  }

  update(slug: string, updateArticleDto: UpdateArticleDto) {
    if (updateArticleDto.title) {
      updateArticleDto['slug'] = this.libService.generateSlug(
        updateArticleDto.title,
      )
    }

    return this.prismaService.article.update({
      where: { slug },
      data: updateArticleDto,
      include: {
        tagList: { select: { title: true } },
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

  remove(slug: string) {
    this.prismaService.article.delete({
      where: {
        slug,
      },
    })
  }

  isFavorited(slug: string, userId: number) {
    const article = this.prismaService.article.findUnique({
      where: {
        slug,
        favoritedBy: {
          some: {
            id: userId,
          },
        },
      },
    })
    return !!article
  }

  favorite(slug: string, userId: number) {
    return this.prismaService.article.update({
      where: { slug },
      data: {
        favoritedBy: {
          connect: {
            id: userId,
          },
        },
        favoritesCount: {
          increment: 1,
        },
      },
      include: {
        tagList: { select: { title: true } },
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

  unfavorite(slug: string, userId: number) {
    return this.prismaService.article.update({
      where: { slug },
      data: {
        favoritedBy: {
          disconnect: {
            id: userId,
          },
        },
        favoritesCount: {
          decrement: 1,
        },
      },
      include: {
        tagList: { select: { title: true } },
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
