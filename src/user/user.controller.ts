import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/auth/user.decorator';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService
  ) { }

  @Get()
  findCurrentUser(@User() username: string) {
    return this.userService.findByUsername(username)
  }
}
