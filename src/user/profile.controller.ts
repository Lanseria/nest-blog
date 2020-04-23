import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { ResponseObject } from 'src/models/response.model';
import { UserProfileResponse } from 'src/models/user.model';
import {
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('profiles')
export class ProfileController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({ description: '通过用户名查询用户' })
  @Get('/:username')
  @UseGuards(new OptionalAuthGuard())
  async findProfile(
    @Param('username') username: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'profile', UserProfileResponse>> {
    const profile = await this.userService.findByUsername(username, user);
    if (!profile) {
      throw new NotFoundException();
    }
    return { profile };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: '关注某用户' })
  @ApiUnauthorizedResponse({ description: '凭证无效' })
  @Post('/:username/follow')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  async followUser(
    @User() user: UserEntity,
    @Param('username') username: string,
  ): Promise<ResponseObject<'profile', UserProfileResponse>> {
    const profile = await this.userService.followUser(user, username);
    return { profile };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: '取关某用户' })
  @ApiUnauthorizedResponse({ description: '凭证无效' })
  @Delete('/:username/follow')
  @UseGuards(AuthGuard())
  async unfollowUser(
    @User() user: UserEntity,
    @Param('username') username: string,
  ): Promise<ResponseObject<'profile', UserProfileResponse>> {
    const profile = await this.userService.unfollowUser(user, username);
    return { profile };
  }
}
