import { JwtPayload } from '@/modules/auth/jwt/entities/jwt.entity';
import { Body, Controller, Get, Patch, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { EditThresholdDto } from './dto/edit-threshold.dto';
import { UpdateGithubTokenDto } from './dto/update-token-github.dto';
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
  @Patch('edit-threshold')
  async editThreshold(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: EditThresholdDto,
  ) {
    const user = req?.user as JwtPayload['user'];

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await this.userService.setThreshold(user.github_id, dto.threshold);
    return res.status(200).json({
      message: 'Threshold updated successfully',
    });
  }

  @Patch('github-token')
  async updateGithubToken(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: UpdateGithubTokenDto,
  ) {
    const user = req?.user as JwtPayload['user'];

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await this.userService.setGithubToken(user.github_id, dto.github_token);
    return res.status(200).json({
      message: 'Github token updated successfully',
    });
  }
}
