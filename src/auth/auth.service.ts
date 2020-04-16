import { Injectable, InternalServerErrorException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from 'src/models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService
  ) { }

  async register(credentials: RegisterDTO) {
    try {
      const user = this.userRepo.create(credentials);
      await user.save()
      const payload = { username: user.username }
      const token = this.jwtService.sign(payload)
      return {
        ...user.toJSON(), token
      }
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username has already been taken')
      }
      throw new InternalServerErrorException()
    }
  }

  async login({ email, password }: LoginDTO) {
    try {
      const user = await this.userRepo.findOne({ where: { email } })
      const isValid = await user.comparePassword(password)
      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials')
      }
      const payload = { username: user.username }
      const token = this.jwtService.sign(payload)
      return {
        ...user.toJSON(),
        token
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials')
    }
  }
}
