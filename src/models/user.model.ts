import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class LoginDTO {

  @IsString()
  @MinLength(4)
  password: string;

  @IsEmail()
  @IsString()
  @MinLength(4)
  email: string;
}

export class RegisterDTO extends LoginDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
}

export class UpdateUserDTO {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  image: string;

  @IsOptional()
  bio: string
}
export interface UserVO {
  id: number
  username: string
  bio: string
  image: string
}
export interface UserProfileVO extends UserVO {
  following: boolean
}

export interface UserLoginVO {
  email: string
  token: string
}

export interface AuthPayload {
  username: string
}