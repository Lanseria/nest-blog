import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserProfileVO } from 'src/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
  ) { }

  async findByUsername(username: string, currentUser?: UserEntity): Promise<UserProfileVO> {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers']
    })
    return user.toProfile(currentUser)
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
