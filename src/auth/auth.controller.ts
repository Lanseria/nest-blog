import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO as RegisterDTO, LoginDTO } from 'src/models/user.model';

@Controller('user')
export class AuthController {

  constructor(private authService: AuthService) { }

  @Post()
  register (@Body(ValidationPipe) credentials: RegisterDTO) {
    return this.authService.register(credentials)
  }

  @Post('/login')
  login (@Body(ValidationPipe) credentials: LoginDTO) {
    return this.authService.login(credentials)
  }
}
