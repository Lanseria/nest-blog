import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

import { UserProfileResponse } from './user.model';

export class CreateArticleDTO {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  body: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  tagList: string[];
}

export class CreateArticleBody {
  @ApiProperty()
  article: CreateArticleDTO;
}

export class UpdateArticleDTO {
  @IsOptional()
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  body: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  tagList: string[];
}

export class UpdateArticleBody {
  @ApiProperty()
  article: UpdateArticleDTO;
}

export interface ArticleResponse {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  favorited: boolean | null;
  favoritesCount: number;
  author: UserProfileResponse;
}

export interface FindFeedQuery {
  limit?: number;
  offset?: number;
}
export interface FindAllQuery extends FindFeedQuery {
  tag?: string;
  author?: string;
  favorited?: string;
}
