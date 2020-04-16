import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from 'src/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
  ) { }

  async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers']
    })
    return user.toProfile()
  }

  async updateUser(username: string, data: UpdateUserDTO) {
    await this.userRepo.update({ username }, data)
    return this.findByUsername(username)
  }

  async followUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers']
    })
    user.followers.push(currentUser)
    await user.save()
    return user.toProfile(currentUser)
  }

  async unfollowUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers']
    })
    user.followers = user.followers.filter(f => f.id !== currentUser.id)
    await user.save()
    return user.toProfile(currentUser)
  }
}
