import { JwtPayload } from '@/modules/auth/jwt/entities/jwt.entity';
import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(readonly userService: UsersService) {}

  @Get('me')
  async profile(@Req() request: Request) {
    const user = request?.user as JwtPayload['user'];
    const fullUser = await this.userService.findOneByGithubId(user.github_id);

    if (!fullUser) {
      return { profile: null };
    }

    const userProfile = {
      github_id: fullUser.gh_user_id,
      username: fullUser.username,
      name: fullUser.name,
      email: fullUser.email,
      avatar_url: fullUser.avatar_url,
    };

    return { profile: userProfile };
  }
}
