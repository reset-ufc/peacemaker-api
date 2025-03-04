import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findOneByGithubId(githubId: string): Promise<UserDocument | null> {
    const users = await this.userModel.findOne({ github_id: githubId }).exec();

    if (!users) {
      return null;
    }

    return users;
  }

  async updateByGithubId(
    githubId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    const user = await this.userModel
      .findOneAndUpdate({ github_id: githubId }, updateUserDto, { new: true })
      .exec();

    if (!user) {
      return null;
    }

    return user;
  }
}
