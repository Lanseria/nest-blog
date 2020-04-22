import {
  Controller,
  Get,
  UseGuards,
  Body,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO, UserResponse } from 'src/models/user.model';
import { AuthService } from 'src/auth/auth.service';
import { ResponseObject } from 'src/models/response.model';

@Controller('user')
export class UserController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findCurrentUser(
    @User() { username }: UserEntity,
  ): Promise<ResponseObject<'user', UserResponse>> {
    const user = await this.authService.findCurrentUser(username);
    return { user };
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(
    @User() { username }: UserEntity,
    @Body(
      'user',
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    data: UpdateUserDTO,
  ): Promise<ResponseObject<'user', UserResponse>> {
    const user = await this.authService.updateUser(username, data);
    return { user };
  }
}
