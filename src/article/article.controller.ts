import { Controller, Get, Param, Post, UseGuards, Body, ValidationPipe, Put, Delete, Query, HttpCode } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, UpdateArticleDTO, FindAllQuery, FindFeedQuery } from 'src/models/article.models';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';

@Controller('articles')
export class ArticleController {
  constructor(
    private articleService: ArticleService
  ) { }
  /**
   * 获取所有文章
   * @param user 当前用户
   * @param query 参数
   */
  @Get()
  @UseGuards(new OptionalAuthGuard())
  async findAll(@User() user: UserEntity, @Query() query: FindAllQuery) {
    const articles = await this.articleService.findAll(user, query)
    return { articles, articlesCount: articles.length }
  }
  /**
   * 获取所有自己所关注的人的文章
   * @param user 当前用户
   * @param query 参数
   */
  @Get('/feed')
  @UseGuards(AuthGuard())
  async findFeed(@User() user: UserEntity, @Query() query: FindFeedQuery) {
    const articles = await this.articleService.findFeed(user, query)
    return { articles, articlesCount: articles.length }
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
    @User() user: UserEntity
  ) {
    const article = await this.articleService.findBySlug(slug)
    return { article: article.toArticle(user) }
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
    @Body(ValidationPipe) data: { article: CreateArticleDTO }
  ) {
    const article = await this.articleService.createArticle(user, data.article)
    return { article: article.toArticle(user) }
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
    @Body(ValidationPipe) data: { article: UpdateArticleDTO }
  ) {
    const article = await this.articleService.updateArticle(slug, user, data.article)
    return { article: article.toArticle(user) }
  }
  /**
   * 删除文章
   * @param slug 文章slug
   * @param user 当前用户
   */
  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deleteArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity
  ) {
    await this.articleService.deleteArticle(slug, user)
  }
  /**
   * 喜欢此文章
   * @param slug 文章slug
   * @param user 当前用户
   */
  @Post('/:slug/favorite')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  async favoriteArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity
  ) {
    const article = await this.articleService.favoriteArticle(slug, user)
    console.log(article.toArticle(user))
    return { article: article.toArticle(user) }
  }
  /**
   * 取消喜欢此文章
   * @param user 当前用户
   */
  @Delete('/:slug/favorite')
  @UseGuards(AuthGuard())
  async unfavoriteArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity
  ) {
    const article = await this.articleService.unfavoriteArticle(slug, user)
    console.log(article.toArticle(user))
    return { article: article.toArticle(user) }
  }
}
