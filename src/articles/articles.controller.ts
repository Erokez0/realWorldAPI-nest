import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  NotFoundException,
  UseInterceptors,
  SetMetadata,
  UseGuards,
  Req,
} from '@nestjs/common'
import { 
  ApiBearerAuth, 
  ApiBody, 
  ApiCreatedResponse, 
  ApiOkResponse, ApiQuery, 
  ApiResponse
 } from '@nestjs/swagger'
import { ArticlesService } from './articles.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { ArticleBodySchema, ArticleEntity, ArticleListResponseSchema, ArticleResponseSchema } from './entities/article.entity'
import { Key } from 'src/common/decorators/key.decorator'
import { RequestResponseInterceptor } from 'src/common/interceptors/request-response.interceptor'
import { AuthGuard } from 'src/auth/auth.guard'
import { UsersService } from 'src/users/users.service'
import { ReqUser, User } from 'src/common/decorators/user.decorator'

@Controller('articles')
@UseInterceptors(RequestResponseInterceptor)
export class ArticlesController {
  constructor (
    private readonly articlesService: ArticlesService,
    private readonly usersService: UsersService
  ) { }

  @Post()
  @Key('article')
  @ApiCreatedResponse(ArticleResponseSchema)
  @UseGuards(AuthGuard)
  @ApiBearerAuth("Token")
  @ApiBody(ArticleBodySchema)
  async create(@Body() createArticleDto: CreateArticleDto, @User() user: ReqUser) {
    return new ArticleEntity(
      await this.articlesService.create(createArticleDto, user.userId),
      false,
      false
    )
  }

  @Get()
  @Key('articles')
  @SetMetadata('meta', ['count', 'articlesCount'])
  @ApiOkResponse(ArticleListResponseSchema)
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'author', required: false })
  @ApiQuery({ name: 'favorited', required: false })
  @ApiQuery({ name: 'limit', required: false, default: 20 })
  @ApiQuery({ name: 'offset', required: false, default: 0 })
  @ApiBearerAuth("Token")
  async findAll(
    @Query('tag') tag: string,
    @Query('author') author: string,
    @Query('favorited') favoritedBy: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
    @User() user: ReqUser
  ) {
    const articles = await this.articlesService.findAll({
      tag,
      author,
      favoritedBy,
      limit,
      offset,
    })
    return articles.map(
      (article) => {
        const isFavorited = user? this.articlesService.isFavorited(article.slug, user.userId) : false;
        const isFollowing = user? this.usersService.isFollowing(user.userId, article.authorId): false;
        return new ArticleEntity(article, isFavorited, isFollowing);
      })
  }

  @Get('/feed')
  @Key('articles')
  @SetMetadata('meta', ['count', 'articlesCount'])
  @ApiOkResponse(ArticleListResponseSchema)
  @ApiQuery({ name: 'limit', required: false, default: 20 })
  @ApiQuery({ name: 'offset', required: false, default: 0 })
  @ApiBearerAuth("Token")
  async feed(
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
    @User() user: ReqUser
  ) {
    const articles = await this.articlesService.findAll({
      tag: null,
      author: null,
      favoritedBy: null,
      limit,
      offset,
    })
    return articles.map(
      (article) => {
        const isFavorited = user? this.articlesService.isFavorited(article.slug, user.userId) : false;
        const isFollowing = user? this.usersService.isFollowing(user.userId, article.authorId) : false;
        return new ArticleEntity(article, isFavorited, isFollowing);
      })
  }

  @Get(':slug')
  @Key('article')
  @ApiOkResponse(ArticleListResponseSchema)
  @ApiBearerAuth("Token")
  async findOne(
    @Param('slug') slug: string,
    @User() user: ReqUser
  ) {
    const article = await this.articlesService.findOne(slug);
    if (!article) {
      throw new NotFoundException(`Article "${slug}" does not exist `)
    }
    const isFavorited = user? this.articlesService.isFavorited(slug, user.userId) : false;
    const isFollowing = user? this.usersService.isFollowing(user.userId, article.authorId) : false;
    return new ArticleEntity(article, isFavorited, isFollowing);
  }

  @Put(':slug')
  @Key('article')
  @ApiOkResponse(ArticleResponseSchema)
  @ApiBearerAuth("Token")
  async update(
    @Param('slug') slug: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @User() user: ReqUser
  ) {
    try {
      const article = await this.articlesService.update(slug, updateArticleDto);
      const isFavorited = user ? this.articlesService.isFavorited(slug, user.userId) : false;
      return new ArticleEntity(
        article,
        isFavorited,
        false)
    } catch {
      throw new NotFoundException(`Article ${slug} does not exist `)
    }
  }

  @Delete(':slug')
  @ApiOkResponse()
  remove(@Param('slug') slug: string) {
    this.articlesService.remove(slug)
  }

  @Post(':slug/favorite')
  @ApiOkResponse(ArticleResponseSchema)
  @ApiBearerAuth("Token")
  @UseGuards(AuthGuard)
  @Key('article')
  async favorite(@Param('slug') slug: string, @User() user: ReqUser) {
    const article = await this.articlesService.findOne(slug)
    if (!article) {
      throw new NotFoundException(`Article "${slug}" does not exist `)
    }
    const isFollowing = user? this.usersService.isFollowing(user.userId, article.authorId) : false;
    return new ArticleEntity( await this.articlesService.favorite(slug, user.userId), true, isFollowing );
  }

  @Delete(':slug/favorite')
  @ApiResponse({status: 200, ...ArticleResponseSchema})
  @ApiBearerAuth("Token")
  @UseGuards(AuthGuard)
  @Key('article')
  async unfavorite(@Param('slug') slug: string, @User() user: ReqUser) {
    const article = await this.articlesService.findOne(slug)
    if (!article) {
      throw new NotFoundException(`Article "${slug}" does not exist `)
    }
    const isFollowing = user? this.usersService.isFollowing(user.userId, article.authorId) : false;
    return new ArticleEntity( await this.articlesService.unfavorite(slug, user.userId), false, isFollowing );
  }
}
