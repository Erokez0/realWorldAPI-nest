import { ApiProperty } from '@nestjs/swagger'

export class TagListEntity {
  @ApiProperty()
  tags: string[]

  constructor(data: { title: string; createdAt: Date; id: number }[]) {
    this.tags = data.map((tag) => tag.title)
  }
}
