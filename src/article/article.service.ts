import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, UpdateArticleDTO } from 'src/models/article.models';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private articleRepo: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
  ) { }

  findBySlug(slug: string): Promise<ArticleEntity> {
    return this.articleRepo.findOne({ where: { slug } })
  }

  private ensureOwnerShip(user: UserEntity, article: ArticleEntity): boolean {
    return user.id === article.author.id
  }

  async createArticle(user: UserEntity, data: CreateArticleDTO) {
    const article = await this.articleRepo.create(data)
    article.author = user
    await article.save()
    return article
  }

  async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
    const article = await this.findBySlug(slug)
    if (!this.ensureOwnerShip(user, article)) {
    } else {
      await this.articleRepo.update({ slug }, data)
      return await this.findBySlug(slug)
    }
  }

  async deleteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug)
    if (!this.ensureOwnerShip(user, article)) {
      throw new UnauthorizedException()
    } else {
      await this.articleRepo.remove(article)
    }
  }
}
