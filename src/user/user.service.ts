import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async createUser(createUserDto: User) {
    const userExists = await this.userModel.findOne({
      github_id: createUserDto.github_id,
    });

    if (userExists) {
      return userExists.toJSON();
    }

    const userCreated = await this.userModel.create(createUserDto);

    return userCreated.toObject();
  }

  async getUser(githubId: string) {
    return this.userModel.findOne({ github_id: githubId });
  }

  async getUsers() {
    return this.userModel.find();
  }

  async profile(githubId: string) {
    const user = await this.userModel.findOne({ github_id: githubId });

    if (!user) {
      return null;
    }

    return user.toJSON();
  }
}
