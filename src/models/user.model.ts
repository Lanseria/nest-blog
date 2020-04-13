import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";

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

export interface AuthPayload {
  username: string

}