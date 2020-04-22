import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  Like,
  FindConditions,
  ObjectLiteral,
} from 'typeorm';

import { ArticleEntity } from 'src/entities/article.entity';
import { UserEntity } from 'src/entities/user.entity';
import {
  CreateArticleDTO,
  UpdateArticleDTO,
  FindAllQuery,
  FindFeedQuery,
} from 'src/models/article.model';
import { TagEntity } from 'src/entities/tag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepo: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(TagEntity) private tagRepo: Repository<TagEntity>,
  ) {}

  private async upsertTags(tagList: string[]) {
    const tags = tagList.map(t => ({ tag: t }));
    const foundTags = await this.tagRepo.find({
      where: tags,
    });
    const newTagList = tagList.filter(
      t => !foundTags.map(t => t.tag).includes(t),
    );
    await Promise.all(
      this.tagRepo.create(newTagList.map(t => ({ tag: t }))).map(t => t.save()),
    );
  }
  /**
   * 通过ID获取文章
   * @param id 文章ID
   */
  private async findById(id: number) {
    const article = await this.articleRepo.findOne(id);
    return article;
  }
  /**
   * 判断是否为自己的文章
   * @param user 当前用户
   * @param article 文章
   */
  private ensureOwnerShip(user: UserEntity, article: ArticleEntity): boolean {
    return user.id === article.author.id;
  }
  /**
   * 过滤参数获取分页参数
   * @param query 参数
   */
  private genTakeSkip(query: FindFeedQuery) {
    const take = query.limit ?? 20;
    const skip = take * (query.offset ?? 0);
    return { take, skip };
  }
  /**
   * 过滤参数获取指定where所需要的参数
   * @param query 参数
   */
  private genWhere(query) {
    const { author, tag, favorited } = query;
    const where:
      | string
      | ObjectLiteral
      | FindConditions<ArticleEntity>
      | FindConditions<ArticleEntity>[] = {};
    if (author) where['author.username'] = author;
    if (favorited) where['favoritedBy.username'] = favorited;
    if (tag) where.tagList = Like(`%${tag}%`);
    return where;
  }
  /**
   * 获取所有文章
   * @param user 当前用户
   * @param query 参数
   */
  async findAll(user: UserEntity, query: FindAllQuery) {
    const findOptions: FindManyOptions<ArticleEntity> = this.genTakeSkip(query);
    findOptions.where = this.genWhere(query);
    const articles = await this.articleRepo.find(findOptions);
    return articles.map(article => article.toArticle(user));
  }
  /**
   * 获取当前用户关注的人的文章
   * @param user 当前用户
   * @param query 参数
   */
  async findFeed(user: UserEntity, query: FindFeedQuery) {
    const { followee } = await this.userRepo.findOne(user.id, {
      relations: ['followee'],
    });
    const findOptions: FindManyOptions<ArticleEntity> = {
      ...this.genTakeSkip(query),
      where: {
        author: followee.map(follow => ({ author: follow.id })),
      },
    };
    const articles = await this.articleRepo.find(findOptions);
    return articles.map(article => article.toArticle(user));
  }
  /**
   * 通过slug获取文章
   * @param slug 文章slug
   */
  async findBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepo.findOne({ where: { slug } });
    return article;
  }
  /**
   * 新增文章
   * @param user 当前用户
   * @param data 传入DTO
   */
  async createArticle(user: UserEntity, data: CreateArticleDTO) {
    const articleDTO = await this.articleRepo.create(data);
    articleDTO.author = user;
    const { id } = await articleDTO.save();
    const article = await this.findById(id);
    await this.upsertTags(article.tagList);
    return article;
  }
  /**
   * 修改文章
   * @param slug 文章slug
   * @param user 当前用户
   * @param data 传入DTO
   */
  async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
    const article = await this.findBySlug(slug);
    if (!this.ensureOwnerShip(user, article)) {
    } else {
      await this.articleRepo.update({ slug }, data);
      return await this.findById(article.id);
    }
  }
  /**
   * 删除自己的文章
   * @param slug 文章slug
   * @param user 当前用户
   */
  async deleteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    if (!this.ensureOwnerShip(user, article)) {
      throw new UnauthorizedException();
    } else {
      await this.articleRepo.remove(article);
    }
  }
  /**
   * 喜欢文章
   * @param slug 文章slug
   * @param user 当前用户
   */
  async favoriteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    article.favoritedBy.push(user);
    await article.save();
    return await this.findById(article.id);
  }
  /**
   * 取消喜欢文章
   * @param slug 文章slug
   * @param user 当前用户
   */
  async unfavoriteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    article.favoritedBy = article.favoritedBy.filter(u => u.id !== user.id);
    await article.save();
    return await this.findById(article.id);
  }
}
