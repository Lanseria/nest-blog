import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO as RegisterDTO, LoginDTO } from 'src/models/user.model';

@Controller('users')
export class AuthController {

  constructor(private authService: AuthService) { }

  @Post()
  async register(@Body(ValidationPipe) credentials: { user: RegisterDTO }) {
    const user = await this.authService.register(credentials.user)
    return { user };
  }

  @Post('/login')
  async login(@Body(ValidationPipe) credentials: { user: LoginDTO }) {
    const user = await this.authService.login(credentials.user)
    return { user };
  }
}
