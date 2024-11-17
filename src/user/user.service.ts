import { Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findUserByGithubId(id: string): Promise<User> {
    const user = await this.userModel.findOne({ githubId: id }).exec();
    if (!user) {
      throw new Error(`Usuário com ID ${id} não encontrado.`);
    }
    return user;
  }
}
