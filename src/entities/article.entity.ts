import slugify from 'slugify';
import { classToPlain } from 'class-transformer';
import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  ManyToMany,
  JoinTable,
  RelationCount,
  OneToMany,
} from 'typeorm';

import { AbstractEntity } from './abstract-entity';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';

@Entity('article')
export class ArticleEntity extends AbstractEntity {
  /**
   * slug 可用的链接符号
   */
  @Column()
  slug: string;
  /**
   * 标题
   */
  @Column()
  title: string;
  /**
   * 描述
   */
  @Column()
  description: string;
  /**
   * 主体
   */
  @Column()
  body: string;
  /**
   * 标签
   */
  @Column('simple-array')
  tagList: string[];
  /**
   * 被喜欢的用户s
   */
  @ManyToMany(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => UserEntity,
    user => user.favorites,
    { eager: true },
  )
  @JoinTable()
  favoritedBy: UserEntity[];
  /**
   * 被喜欢的人数
   */
  @RelationCount((article: ArticleEntity) => article.favoritedBy)
  favoritesCount: number;
  /**
   * 作者
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(
    type => UserEntity,
    user => user.articles,
    { eager: true },
  )
  author: UserEntity;
  @OneToMany(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => CommentEntity,
    comment => comment.article,
    { eager: true },
  )
  comments: CommentEntity;
  /**
   * 插入文章前生成slug
   */
  @BeforeInsert()
  generateSlug() {
    const slug = slugify(this.title, { lower: true });
    const random = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    this.slug = `${slug}-${random}`;
  }

  toJSON() {
    return classToPlain(this);
  }
  /**
   * 转换为文章JSON
   * @param user 判断验证自己是否关注此人(传入一个用户)
   */
  toArticle(user?: UserEntity) {
    let favorited = null;
    if (user) {
      favorited = this.favoritedBy.map(u => u.id).includes(user.id);
    }
    const article: any = this.toJSON();
    delete article.favoritedBy;
    return {
      ...article,
      favorited,
    };
  }
}
