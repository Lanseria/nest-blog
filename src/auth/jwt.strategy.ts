import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'

import { UserEntity } from "src/entities/user.entity";
import { AuthPayload } from "src/models/user.model";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity) private userRepo:
      Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
      secretOrKey: process.env.SECRET
    })
  }

  async validate(payload: AuthPayload) {
    const { username } = payload
    const user = this.userRepo.find({ where: { username } })
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}