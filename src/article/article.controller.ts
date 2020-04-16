import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO } from 'src/models/article.models';

@Controller('articles')
export class ArticleController {
  constructor(
    private articleService: ArticleService
  ) { }
  @Get('/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const article = await this.articleService.findBySlug(slug)
    return { article }
  }

  @Post()
  @UseGuards(AuthGuard())
  async createArticle(@User() user: UserEntity, data: { article: CreateArticleDTO }) {
    const article = await this.articleService.createArticle(user, data.article)
    return { article }
  }

}
