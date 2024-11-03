import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthService } from '../jwt/jwt-auth.service';
import { GithubOauthGuard } from './github-oauth.guard';
import { User } from '@/user/entities/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth/github')
export class GithubOauthController {
  constructor(private jwtAuthService: JwtAuthService) {}

  @ApiOperation({ summary: 'Authenticate user with GitHub' })
  @ApiResponse({
    status: 302,
    description: 'Redirect to GitHub OAuth login page.',
  })
  @Get()
  @UseGuards(GithubOauthGuard)
  async githubAuth() {
    // With `@UseGuards(GithubOauthGuard)` we are using an AuthGuard that @nestjs/passport
    // automatically provisioned for us when we extended the passport-github2 strategy.
    // The Guard initiates the passport-github flow.
  }

  @ApiOperation({ summary: 'Authenticate user with GitHub' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully authenticated.',
  })
  @Get('callback')
  @UseGuards(GithubOauthGuard)
  async githubAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Passport automatically creates a `user` object, based on the return value of our
    // GithubOauthStrategy#validate() method, and assigns it to the Request object as `req.user`

    const user = req.user as User;

    // TODO delete
    console.log(
      `${this.githubAuthCallback.name}(): req.user = ${JSON.stringify(user, null, 4)}`,
    );

    const { accessToken } = this.jwtAuthService.login(user);
    res.cookie('jwt', accessToken);
    return { access_token: accessToken };
  }
}
