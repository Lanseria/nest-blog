import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  ValidationPipe,
  Put,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';

import {
  CreateArticleDTO,
  UpdateArticleDTO,
  FindAllQuery,
  FindFeedQuery,
  ArticleResponse,
  CreateArticleBody,
  UpdateArticleBody,
} from 'src/models/article.model';
import { ArticleService } from './article.service';
import { CommentService } from './comment.service';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import {
  CreateCommentDTO,
  CommentResponse,
  CreateCommentBody,
} from 'src/models/comment.model';
import { ResponseObject } from 'src/models/response.model';

@Controller('articles')
export class ArticleController {
  constructor(
    private articleService: ArticleService,
    private commentService: CommentService,
  ) {}
  /**
   * 获取所有文章
   * @param user 当前用户
   * @param query 参数
   */
  @Get()
  @UseGuards(new OptionalAuthGuard())
  async findAll(
    @User() user: UserEntity,
    @Query() query: FindAllQuery,
  ): Promise<
    ResponseObject<'articles', ArticleResponse[]> &
      ResponseObject<'articlesCount', number>
  > {
    const articles = await this.articleService.findAll(user, query);
    return { articles, articlesCount: articles.length };
  }
  /**
   * 获取所有自己所关注的人的文章
   * @param user 当前用户
   * @param query 参数
   */
  @Get('/feed')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async findFeed(
    @User() user: UserEntity,
    @Query() query: FindFeedQuery,
  ): Promise<
    ResponseObject<'articles', ArticleResponse[]> &
      ResponseObject<'articlesCount', number>
  > {
    const articles = await this.articleService.findFeed(user, query);
    return { articles, articlesCount: articles.length };
  }
  /**
   * 通过slug获取文章
   * @param slug 文章slug
   * @param user 当前用户
   */
  @Get('/:slug')
  @UseGuards(new OptionalAuthGuard())
  async findBySlug(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'article', ArticleResponse>> {
    const article = await this.articleService.findBySlug(slug);
    return { article: article.toArticle(user) };
  }
  /**
   * 创建文章
   * @param user 当前用户
   * @param data 传入文章DTO
   */
  @ApiBearerAuth()
  @ApiOkResponse({ description: '创建文章' })
  @ApiBody({ type: CreateArticleBody })
  @Post()
  @UseGuards(AuthGuard())
  async createArticle(
    @User() user: UserEntity,
    @Body('article', ValidationPipe) data: CreateArticleDTO,
  ): Promise<ResponseObject<'article', ArticleResponse>> {
    const article = await this.articleService.createArticle(user, data);
    return { article: article.toArticle(user) };
  }
  /**
   * 修改文章
   * @param slug 文章slug
   * @param user 当前用户
   * @param data 传入文章DTO
   */
  @ApiBearerAuth()
  @ApiOkResponse({ description: '修改文章' })
  @ApiBody({ type: UpdateArticleBody })
  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body('article', ValidationPipe) data: UpdateArticleDTO,
  ): Promise<ResponseObject<'article', ArticleResponse>> {
    const article = await this.articleService.updateArticle(slug, user, data);
    return { article: article.toArticle(user) };
  }
  /**
   * 删除文章
   * @param slug 文章slug
   * @param user 当前用户
   */
  @ApiBearerAuth()
  @ApiOkResponse({ description: '删除此文章' })
  @ApiUnauthorizedResponse()
  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deleteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
    await this.articleService.deleteArticle(slug, user);
  }
  /**
   * 喜欢此文章
   * @param slug 文章slug
   * @param user 当前用户
   */
  @ApiBearerAuth()
  @ApiOkResponse({ description: '喜欢此文章' })
  @ApiUnauthorizedResponse()
  @Post('/:slug/favorite')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  async favoriteArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'article', ArticleResponse>> {
    const article = await this.articleService.favoriteArticle(slug, user);
    return { article: article.toArticle(user) };
  }

  /**
   * 取消喜欢此文章
   * @param user 当前用户
   */
  @ApiBearerAuth()
  @ApiOkResponse({ description: '不喜欢此文章' })
  @ApiUnauthorizedResponse()
  @Delete('/:slug/favorite')
  @UseGuards(AuthGuard())
  async unfavoriteArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'article', ArticleResponse>> {
    const article = await this.articleService.unfavoriteArticle(slug, user);
    return { article: article.toArticle(user) };
  }
  /**
   * 查询评论
   * @param slug 文章slug
   */
  @ApiOkResponse({ description: '此文章下的评论' })
  @ApiUnauthorizedResponse()
  @Get('/:slug/comments')
  async findAllByArticleSlug(
    @Param('slug') slug: string,
  ): Promise<ResponseObject<'comments', CommentResponse[]>> {
    const comments = await this.commentService.findAllByArticleSlug(slug);
    return { comments };
  }
  /**
   * 做评论
   * @param slug 文章slug
   * @param user 当前用户
   * @param data 评论数据
   */
  @ApiBearerAuth()
  @ApiOkResponse({ description: '评论' })
  @ApiUnauthorizedResponse()
  @ApiBody({ type: CreateCommentBody })
  @Post('/:slug/comments')
  @UseGuards(AuthGuard())
  async createComment(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body('comment', ValidationPipe) data: CreateCommentDTO,
  ): Promise<ResponseObject<'comment', CommentResponse>> {
    const comment = await this.commentService.createComment(slug, user, data);
    return { comment };
  }
  /**
   * 删除评论
   * @param id 评论ID
   * @param user 当前用户
   */
  @ApiBearerAuth()
  @ApiOkResponse({ description: '删除评论' })
  @ApiUnauthorizedResponse()
  @Delete('/:slug/comments/:id')
  @UseGuards(AuthGuard())
  async deleteComment(
    // @Param('slug') slug: string,
    @Param('id') id: number,
    @User() user: UserEntity,
  ) {
    await this.commentService.deleteComment(id, user);
  }
}
