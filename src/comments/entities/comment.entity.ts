import { ApiHideProperty, ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { Comment, Prisma } from '@prisma/client'
import { Exclude, Type } from 'class-transformer'

type CommentAuthor = Prisma.CommentGetPayload<{
  include: {
    author: {
      select: {
        username: true
        bio: true
        image: true
      }
    }
  }
}>

class Author {
  username: string
  bio: string | null
  image: string
  following: boolean
}
// type CommentEntityType = Omit<
//   CommentAuthor,
//   'author' | 'authorId' | 'articleId'
// > & {
//   author: Author
// }
export class CommentEntity {
  @ApiProperty()
  id: number

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  body: string

  @ApiHideProperty()
  @Exclude()
  articleId: number

  @ApiHideProperty()
  @Exclude()
  authorId: number

  @ApiProperty()
  @Type(() => Author)
  author: Author

  constructor(userData: CommentAuthor, isFollowing: boolean) {
    Object.assign(this, userData)
    this.author.following = isFollowing
  }
}

export const CommentBodySchema = {
  schema: {
    properties: {
      comment: {
        properties: {
          body: { type: 'string' },
        },
      },
    },
  },
}
export const CommentResponseSchema = {
  schema: {
    properties: {
      comment: {
        $ref: getSchemaPath(CommentEntity),
      },
    },
  },
}
export const CommentListResponseSchema = {
  schema: {
    properties: {
      comments: {
        type: 'array',
        items: {
          $ref: getSchemaPath(CommentEntity),
        },
      },
    },
  },
}
