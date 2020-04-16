import { Entity, Column, BeforeInsert, JoinTable, ManyToMany } from "typeorm";
import * as bcrypt from 'bcryptjs'
import { Exclude, classToPlain } from 'class-transformer'
import { IsEmail } from 'class-validator'
import { AbstractEntity } from "./abstract-entity";

@Entity('user')
export class UserEntity extends AbstractEntity {
  /**
   * 电子邮件
   */
  @Column()
  @IsEmail()
  @Column({ unique: true })
  email: string
  /**
   * 用户名
   */
  @Column({ unique: true })
  username: string
  /**
   * 座右铭
   */
  @Column({ default: '' })
  bio: string

  /**
   * 头像
   */
  @Column({ default: null, nullable: true })
  image: string | null

  /**
   * 密码(HASH加密)
   */
  @Column()
  @Exclude()
  password: string
  /**
   * 粉丝
   */
  @ManyToMany(type => UserEntity, user => user.followee)
  @JoinTable()
  followers: UserEntity[];
  /**
   * 关注的人
   */
  @ManyToMany(type => UserEntity, user => user.followers)
  @JoinTable()
  followee: UserEntity[];
  /**
   * 新增用户注册时密码加密
   */
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10)
  }
  /**
   * 验证HASH密码正确性
   * @param attempt 用来对比的字符串
   */
  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password)
  }
  /**
   * 转化为正确JSON
   */
  toJSON() {
    return classToPlain(this)
  }

  toProfile(user?: UserEntity) {
    let following = null
    if (user) {
      following = this.followers.includes(user)
    }
    const profile: any = this.toJSON()
    delete profile.followers
    return {
      ...profile, following
    }
  }
}