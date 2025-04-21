import { Injectable } from '@nestjs/common';
import { Article } from '@prisma/client';

@Injectable()
export class LibService {
  generateSlug(title: Article["title"]): Article["slug"] {
    return title.replaceAll(/\s+/g, '-').toLowerCase()
  }
}
