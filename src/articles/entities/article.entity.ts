import { Article, Prisma } from '@prisma/client'
import { ApiHideProperty, ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { Exclude, Transform, Type } from 'class-transformer'
import { CreateArticleDto } from '../dto/create-article.dto'
type ArticleAuthorTagList = Prisma.ArticleGetPayload<{
  include: {
    tagList: {
      select: {
        title: true
      }
    }
    author: {
      select: {
        username: true
        bio: true
        image: true
      }
    }
  }
}>

class TagList {
  title: string
}

class Author {
  username: string
  bio: string
  image: string | null
  following: boolean
}

type ArticleEntityType = Omit<
  ArticleAuthorTagList,
  'authorId' | 'id' | 'tagList' | 'author'
> & {
  author: Author
} & {
  tagList: string[]
}

function tagListToStringArr(tagList: TagList[]) {
  return tagList.map((tag) => tag.title)
}

export class ArticleEntity implements ArticleEntityType {
  @ApiProperty()
  slug: string

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string

  @ApiProperty()
  body: string

  @ApiProperty({ isArray: true })
  @Type(() => TagList)
  @Transform((tagList) => tagListToStringArr(tagList.value))
  tagList: string[]

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  favorited: boolean

  @ApiProperty()
  favoritesCount: number

  @ApiProperty()
  @Type(() => Author)
  author: Author

  @ApiHideProperty()
  @Exclude()
  authorId: number

  @ApiHideProperty()
  @Exclude()
  id: number

  constructor(
    data: ArticleAuthorTagList,
    favorited: boolean,
    isFollowing: boolean,
  ) {
    Object.assign(this, data)
    this.author.following = isFollowing
    this.favorited = favorited
  }
}

export const ArticleBodySchema = {
  schema: {
    properties: {
      article: {
        $ref: getSchemaPath(CreateArticleDto),
      },
    },
  },
}

export const ArticleResponseSchema = {
  schema: {
    properties: {
      article: {
        $ref: getSchemaPath(ArticleEntity),
      },
    },
  },
}

export const ArticleListResponseSchema = {
  schema: {
    properties: {
      articles: {
        type: 'array',
        items: {
          $ref: getSchemaPath(ArticleEntity),
        },
      },
      articlesCount: {
        type: 'number',
      },
    },
  },
}
