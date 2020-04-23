import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { UserProfileResponse } from './user.model';
import { UserEntity } from 'src/entities/user.entity';

export class CreateCommentDTO {
  @IsString()
  @ApiProperty()
  body: string;
}

export class CreateCommentBody {
  @ApiProperty()
  comment: CreateCommentDTO;
}

export class CommentResponse {
  id: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  body: string;
  author: UserProfileResponse | UserEntity;
}
