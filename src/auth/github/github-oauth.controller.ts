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
    const githubUser = req.user as User;
  
    // Preencher campos obrigatórios se necessário
    const userForJwt = {
      id: githubUser.id,
      displayName: githubUser.displayName,
    };

    const jwt = this.jwtAuthService.login(userForJwt);
  
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS em produção
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semana
    });
  
    return {
      message: 'Login successful',
      user: {
        id: githubUser.id,
        username: githubUser.username,
        displayName: githubUser.displayName,
        profileUrl: githubUser.profileUrl,
        photos: githubUser.photos,
      },
    };
  }

}
