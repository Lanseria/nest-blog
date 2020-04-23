import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import {
  RegisterDTO,
  LoginDTO,
  AuthResponse,
  RegisterBody,
  LoginBody,
} from 'src/models/user.model';
import { ResponseObject } from 'src/models/response.model';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({ description: '用户注册' })
  @ApiBody({ type: RegisterBody })
  @Post()
  async register(
    @Body('user', ValidationPipe) credentials: RegisterDTO,
  ): Promise<ResponseObject<'user', AuthResponse>> {
    const user = await this.authService.register(credentials);
    return { user };
  }

  @ApiCreatedResponse({ description: '用户登录' })
  @ApiUnauthorizedResponse({ description: '凭证无效' })
  @ApiBody({ type: LoginBody })
  @Post('/login')
  async login(
    @Body('user', ValidationPipe) credentials: LoginDTO,
  ): Promise<ResponseObject<'user', AuthResponse>> {
    const user = await this.authService.login(credentials);
    return { user };
  }
}
