import { Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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
}
