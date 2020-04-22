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
  CreateArticleDTO,
  UpdateArticleDTO,
  FindAllQuery,
  FindFeedQuery,
} from 'src/models/article.model';
import { ArticleService } from './article.service';
import { CommentService } from './comment.service';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { CreateCommentDTO } from 'src/models/comment.model';

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
  async findAll(@User() user: UserEntity, @Query() query: FindAllQuery) {
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
  async findFeed(@User() user: UserEntity, @Query() query: FindFeedQuery) {
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
  async findBySlug(@Param('slug') slug: string, @User() user: UserEntity) {
    const article = await this.articleService.findBySlug(slug);
    return { article: article.toArticle(user) };
  }
  /**
   * 创建文章
   * @param user 当前用户
   * @param data 传入文章DTO
   */
  @Post()
  @UseGuards(AuthGuard())
  async createArticle(
    @User() user: UserEntity,
    @Body('article', ValidationPipe) data: CreateArticleDTO,
  ) {
    const article = await this.articleService.createArticle(user, data);
    return { article: article.toArticle(user) };
  }
  /**
   * 修改文章
   * @param slug 文章slug
   * @param user 当前用户
   * @param data 传入文章DTO
   */
  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body('article', ValidationPipe) data: UpdateArticleDTO,
  ) {
    const article = await this.articleService.updateArticle(slug, user, data);
    return { article: article.toArticle(user) };
  }
  /**
   * 删除文章
   * @param slug 文章slug
   * @param user 当前用户
   */
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
  @Post('/:slug/favorite')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  async favoriteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
    const article = await this.articleService.favoriteArticle(slug, user);
    console.log(article.toArticle(user));
    return { article: article.toArticle(user) };
  }
  /**
   * 取消喜欢此文章
   * @param user 当前用户
   */
  @Delete('/:slug/favorite')
  @UseGuards(AuthGuard())
  async unfavoriteArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ) {
    const article = await this.articleService.unfavoriteArticle(slug, user);
    console.log(article.toArticle(user));
    return { article: article.toArticle(user) };
  }

  @Get('/:slug/comments')
  async findAllByArticleSlug(@Param('slug') slug: string) {
    const comments = await this.commentService.findAllByArticleSlug(slug);
    return { comments };
  }

  @Post('/:slug/comments')
  @UseGuards(AuthGuard())
  async createComment(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body('comment', ValidationPipe) data: CreateCommentDTO,
  ) {
    const comment = await this.commentService.createComment(slug, user, data);
    return { comment };
  }

  @Delete('/:slug/comments/:id')
  @UseGuards(AuthGuard())
  async deleteComment(
    @Param('slug') slug: string,
    @Param('id') id: number,
    @User() user: UserEntity,
  ) {
    const comment = await this.commentService.deleteComment(id, user);
    return comment;
  }
}
