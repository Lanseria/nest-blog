import {
  Entity,
  Column,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude, classToPlain } from 'class-transformer';
import { IsEmail } from 'class-validator';

import { AbstractEntity } from './abstract-entity';
import { ArticleEntity } from './article.entity';
import { UserProfileVO } from 'src/models/user.model';
import { CommentEntity } from './comment.entity';

@Entity('user')
export class UserEntity extends AbstractEntity {
  /**
   * 电子邮件
   */
  @Column()
  @IsEmail()
  @Column({ unique: true })
  email: string;
  /**
   * 用户名
   */
  @Column({ unique: true })
  username: string;
  /**
   * 座右铭
   */
  @Column({ default: '' })
  bio: string;

  /**
   * 头像
   */
  @Column({ default: null, nullable: true })
  image: string | null;

  /**
   * 密码(HASH加密)
   */
  @Column()
  @Exclude()
  password: string;
  /**
   * TA的文章
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany(
    type => ArticleEntity,
    article => article.author,
  )
  articles: ArticleEntity[];
  /**
   * TA的评论
   */
  @OneToMany(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => CommentEntity,
    comment => comment.author,
  )
  comments: Comment[];
  /**
   * TA喜欢的文章
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany(
    type => ArticleEntity,
    article => article.favoritedBy,
  )
  @JoinTable()
  favorites: ArticleEntity[];
  /**
   * 粉丝
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany(
    type => UserEntity,
    user => user.followee,
  )
  @JoinTable()
  followers: UserEntity[];
  /**
   * 关注的人
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany(
    type => UserEntity,
    user => user.followers,
  )
  @JoinTable()
  followee: UserEntity[];
  /**
   * 新增用户注册时密码加密
   */
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
  /**
   * 验证HASH密码正确性
   * @param attempt 用来对比的字符串
   */
  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }
  /**
   * 转化为普通JSON
   */
  toJSON() {
    return classToPlain(this);
  }
  /**
   * 转换为个人资料JSON
   * @param user 判断验证自己是否关注此人(传入一个用户)
   */
  toProfile(user?: UserEntity): UserProfileVO {
    let following = null;
    if (user) {
      following = this.followers.map(u => u.id).includes(user.id);
    }
    const profile: any = this.toJSON();
    delete profile.followers;
    return {
      ...profile,
      following,
    };
  }
}
