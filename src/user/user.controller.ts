import { Controller, Get, UseGuards, Body, Put, ValidationPipe } from '@nestjs/common';
import { User } from 'src/auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/models/user.model';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private authService: AuthService
  ) { }

  @Get()
  @UseGuards(AuthGuard())
  async findCurrentUser(@User() { username }: UserEntity) {
    const user = await this.authService.findCurrentUser(username)
    return { user }
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(@User() { username }: UserEntity, @Body(new ValidationPipe({
    transform: true,
    whitelist: true
  })) data: { user: UpdateUserDTO }) {
    const user = await this.authService.updateUser(username, data.user)
    return { user }
  }
}
