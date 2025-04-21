import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiHeader, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Key } from 'src/common/decorators/key.decorator';
import { RequestResponseInterceptor } from 'src/common/interceptors/request-response.interceptor';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';
import { ReqUser, User } from 'src/common/decorators/user.decorator';
import { CommentBodySchema, CommentEntity, CommentListResponseSchema, CommentResponseSchema } from './entities/comment.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';

@ApiBearerAuth()
@Controller()
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly userService: UsersService
    ) { }

    @UseGuards(AuthGuard)
    @Key('comment')
    @UseInterceptors(RequestResponseInterceptor)
    @ApiCreatedResponse(CommentResponseSchema)
    @Post('/articles/:slug/comments')
    @ApiBody(CommentBodySchema)
    @ApiBearerAuth("Token")
    async addComment(
        @Body() createCommentDto: CreateCommentDto,
        @Param('slug') slug: string,
        @User() user: ReqUser
    ) {
        const comment = await this.commentsService.create(createCommentDto, slug, user.userId);
        const isFollowing = this.userService.isFollowing(user.userId, comment.authorId);
        return new CommentEntity(comment, isFollowing);
    }

    @ApiOkResponse(CommentListResponseSchema)
    @UseInterceptors(RequestResponseInterceptor)
    @ApiBearerAuth("Token")
    @Key('comments')
    @Get('/articles/:slug/comments')
    async getComments(
        @Param('slug') slug: string,
        @User() user: ReqUser
    ) {
        const comments = await this.commentsService.findAll(slug);
        return comments.map(comment => {
            const isFollowing = user ? this.userService.isFollowing(user.userId, comment.authorId) : false;
            return new CommentEntity(comment, isFollowing);
        })
    }

}
