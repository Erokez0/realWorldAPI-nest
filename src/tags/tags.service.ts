import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class TagsService {
  constructor(private prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.tag.findMany()
  }
}
