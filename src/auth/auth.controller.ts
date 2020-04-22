import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDTO, LoginDTO } from 'src/models/user.model';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async register(@Body('user', ValidationPipe) credentials: RegisterDTO) {
    const user = await this.authService.register(credentials);
    return { user };
  }

  @Post('/login')
  async login(@Body('user', ValidationPipe) credentials: LoginDTO) {
    const user = await this.authService.login(credentials);
    return { user };
  }
}
