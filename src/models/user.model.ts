import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/entities/user.entity';

export class LoginDTO {
  @IsString()
  @MinLength(4)
  @ApiProperty({
    type: String,
    description: 'password',
  })
  password: string;

  @IsEmail()
  @IsString()
  @MinLength(4)
  @ApiProperty({
    type: String,
    description: 'email',
  })
  email: string;
}

export class RegisterDTO extends LoginDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    type: String,
    description: 'username',
  })
  username: string;
}

export class UpdateUserDTO {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  image: string;

  @IsOptional()
  bio: string;
}
export interface UserResponse extends Partial<UserEntity> {
  id?: number;
  username?: string;
  bio?: string;
  image?: string;
}
export interface UserProfileResponse extends UserResponse {
  following: boolean;
}

export interface UserLoginVO {
  email: string;
  token: string;
}

export interface AuthPayload {
  username: string;
}

export interface AuthResponse extends UserResponse {
  token: string;
}
