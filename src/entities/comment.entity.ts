import { Entity, Column, ManyToOne } from 'typeorm';
import { classToPlain } from 'class-transformer';

import { AbstractEntity } from './abstract-entity';
import { UserEntity } from './user.entity';
import { ArticleEntity } from './article.entity';

@Entity('comment')
export class CommentEntity extends AbstractEntity {
  /**
   * 内容
   */
  @Column()
  body: string;
  /**
   * 作者
   */
  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => UserEntity,
    user => user.comments,
    { eager: true },
  )
  author: UserEntity;

  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => ArticleEntity,
    article => article.comments,
  )
  article: ArticleEntity;

  toJSON() {
    return classToPlain(this);
  }
}
