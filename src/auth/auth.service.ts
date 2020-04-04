import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from 'src/models/user.dto';

@Injectable()
export class AuthService {
  private mockUser = {
    "email": "jake@jake.jake",
    "token": "jwt.token.here",
    "username": "jake",
    "bio": "I work at statefarm",
    "image": null
  }
  login (credentials: LoginDTO) {
    if (credentials.email === this.mockUser.email) {
      return this.mockUser
    } else {
      throw new InternalServerErrorException;
    }
  }
  register (credentials: RegisterDTO) {
    return this.mockUser
  }
}
