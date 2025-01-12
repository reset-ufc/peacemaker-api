import { Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('v1/user')
export class UserController {
  constructor(readonly userService: UserService) {}

  @Post()
  create() {
    return 'Create User';
  }

  @Get('profile')
  async profile(@Req() request: Request) {
    const user = request.user as User;
    const fullUser = await this.userService.findOneByGithubId(user.github_id);

    const userProfile = {
      github_id: fullUser?.github_id,
      username: fullUser?.username,
      name: fullUser?.name,
      email: fullUser?.email,
      avatar_url: fullUser?.avatar_url,
    };

    return { profile: userProfile };
  }

  @Patch('profile')
  update() {
    return 'Update';
  }
}
