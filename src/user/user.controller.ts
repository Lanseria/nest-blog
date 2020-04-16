import { Controller, Get, UseGuards, Body, Put, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/models/user.model';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService
  ) { }

  @Get()
  @UseGuards(AuthGuard())
  async findCurrentUser(@User() { username }: UserEntity) {
    const user = await this.userService.findByUsername(username)
    return { user }
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(@User() { username }: UserEntity, @Body(new ValidationPipe({
    transform: true,
    whitelist: true
  })) data: UpdateUserDTO) {
    const user = await this.userService.updateUser(username, data)
    return { user }
  }
}
