import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  public async findOneByGithubId(githubId: number) {
    return this.userModel.findOne({ github_id: githubId }).exec();
  }

  public async updateByGithubId(
    githubId: number,
    updateUserDto: UpdateUserDto,
  ) {
    return this.userModel.findOneAndUpdate(
      { github_id: githubId },
      { updateUserDto },
      { new: true },
    );
  }
}
