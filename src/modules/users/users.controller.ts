import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(readonly userService: UsersService) {}

  @Get('me')
  async profile(@Req() request: Request, @Res() response: Response) {
    const user = request.user as User;
    const fullUser = await this.userService.findOneByGithubId(user.github_id);

    if (!fullUser) {
      return { profile: null };
    }

    const userProfile = {
      github_id: fullUser.github_id,
      username: fullUser.username,
      name: fullUser.name,
      email: fullUser.email,
      avatar_url: fullUser.avatar_url,
    };

    return response.status(200).json(userProfile);
  }
}
