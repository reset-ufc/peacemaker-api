import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthService } from '@/auth/jwt/jwt-auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/config/interfaces/app-config';
import {
  AccessTokenGithubResponse,
  UserGithubResponse,
} from './entities/github-response.entity';
import { UserService } from '@/user/user.service';

@ApiTags('auth')
@Controller('auth/github')
export class GithubOauthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  @ApiOperation({ summary: 'Authenticate user with GitHub' })
  @ApiResponse({
    status: 302,
    description: 'Redirect to GitHub OAuth login page.',
  })
  @Get()
  async githubAuth(@Res({ passthrough: true }) response: Response) {
    const githubClientId = this.configService.get<string>(
      'auth.github.clientId',
    );

    return response.redirect(
      `https://github.com/login/oauth/authorize?client_id=${githubClientId}&response_type=code`,
    );
  }

  @ApiOperation({ summary: 'Authenticate user with GitHub' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully authenticated.',
  })
  @Get('callback')
  async githubAuthCallback(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Query('code') code: string,
  ) {
    const responseAccessToken = await this.getGithubAccessToken(code);

    try {
      const responseUser = await this.getGithubUser(
        responseAccessToken.access_token,
      );

      const userCreated = await this.userService.createUser({
        avatar_url: responseUser.avatar_url,
        email: responseUser.email,
        github_id: responseUser.id,
        login: responseUser.login,
        name: responseUser.name,
        node_id: responseUser.node_id,
        site_admin: responseUser.site_admin,
        github_token: responseAccessToken.access_token,
      });

      const { accessToken } = this.jwtAuthService.login(userCreated);

      return response.status(200).json({ access_token: accessToken });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return response.status(error.response?.status || 500).json({
          message: error.response?.data || 'Axios Error',
          status: error.response?.status,
        });
      }

      return response.status(500).json({
        message: 'An unexpected error occurred',
      });
    }
  }

  private async getGithubAccessToken(code: string) {
    const githubClientId = this.configService.get<string>(
      'auth.github.clientId',
    );
    const githubSecret = this.configService.get<string>(
      'auth.github.clientSecret',
    );
    const githubState = this.configService.get<string>('auth.github.scope');

    const response = (await this.httpService.axiosRef
      .post('https://github.com/login/oauth/access_token', {
        client_id: githubClientId,
        client_secret: githubSecret,
        code,
        state: githubState,
      })
      .then((response) => response.data)
      .then((response) => {
        const pairs: Array<string> = response.split('&');

        const responseObject: AccessTokenGithubResponse = {
          access_token: '',
          expires_in: 0,
          refresh_token: '',
          refresh_token_expires_in: 0,
          scope: '',
          token_type: '',
        };

        pairs.forEach((pair) => {
          const [key, value] = pair.split('=');
          if (key in responseObject) {
            (responseObject[
              key as keyof typeof responseObject
            ] as unknown as string) = value;
          }
        });

        return responseObject;
      })) as unknown as AccessTokenGithubResponse;

    return response;
  }

  private async getGithubUser(
    accessToken: string,
  ): Promise<UserGithubResponse> {
    const responseUser = (await this.httpService.axiosRef
      .get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((responseUser) => {
        return responseUser.data;
      })) as unknown as UserGithubResponse;

    return responseUser;
  }
}
