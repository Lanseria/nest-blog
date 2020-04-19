import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity } from 'src/entities/comment.entity';
import { CreateCommentDTO } from 'src/models/comment.model';
import { UserEntity } from 'src/entities/user.entity';
import { ArticleService } from './article.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity) private commentRepo: Repository<CommentEntity>,
    private articleService: ArticleService
  ) { }

  private ensureOwnerShip(user: UserEntity, comment: CommentEntity): boolean {
    return user.id === comment.author.id
  }

  async findById(id: number) {
    const comment = await this.commentRepo.findOne(id)
    return comment
  }

  async findAllByArticleSlug(slug: string) {
    const comments = await this.commentRepo.find({
      where: {
        'article.slug': slug
      },
    })
    return comments
  }

  async createComment(slug: string, user: UserEntity, data: CreateCommentDTO) {
    const article = await this.articleService.findBySlug(slug)
    if (!article) {
      throw new NotFoundException()
    }
    const comment = this.commentRepo.create(data)
    comment.article = article
    comment.author = user
    await comment.save()
    return this.findById(comment.id)
  }

  async deleteComment(id: number, user: UserEntity) {
    const comment = await this.findById(id)
    if (!this.ensureOwnerShip(user, comment)) {
      throw new UnauthorizedException()
    }
    await this.commentRepo.remove(comment)
  }
}
