import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountCreatedEvent } from './create-account.event';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);

    const userCreated = await user.save();

    this.eventEmitter.emit(
      'account.created',
      new AccountCreatedEvent(userCreated.gh_user_id),
    );

    return userCreated;
  }

  async findOneByGithubId(githubId: string): Promise<UserDocument | null> {
    const users = await this.userModel.findOne({ gh_user_id: githubId }).exec();

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
      .findOneAndUpdate({ gh_user_id: githubId }, updateUserDto, { new: true })
      .exec();

    if (!user) {
      return null;
    }

    return user;
  }
}
