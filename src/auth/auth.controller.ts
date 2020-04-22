import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDTO, LoginDTO, AuthResponse } from 'src/models/user.model';
import { ResponseObject } from 'src/models/response.model';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @ApiCreatedResponse({
    description: '用户注册',
  })
  @ApiBody({
    type: RegisterDTO,
  })
  async register(
    @Body('user', ValidationPipe) credentials: RegisterDTO,
  ): Promise<ResponseObject<'user', AuthResponse>> {
    const user = await this.authService.register(credentials);
    return { user };
  }

  @Post('/login')
  @ApiCreatedResponse({
    description: '用户登录',
  })
  @ApiUnauthorizedResponse({
    description: '凭证无效',
  })
  @ApiBody({
    type: LoginDTO,
  })
  async login(
    @Body('user', ValidationPipe) credentials: LoginDTO,
  ): Promise<ResponseObject<'user', AuthResponse>> {
    const user = await this.authService.login(credentials);
    return { user };
  }
}
