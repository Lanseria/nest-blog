import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateArticleDTO {

  @IsString()
  title: string

  @IsString()
  body: string

  @IsString()
  description: string

  @IsArray()
  @IsString({ each: true })
  tagList: string[]
}

export class UpdateArticleDTO {
  @IsOptional()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  body: string

  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagList: string[]
}
