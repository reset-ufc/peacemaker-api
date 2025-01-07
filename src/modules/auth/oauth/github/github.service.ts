import {
  GITHUB_AUTHORIZATION_URL,
  GITHUB_PROFILE_URL,
  GITHUB_TOKEN_URL,
} from '@/config/github.containsts';
import { JwtAuthService } from '@/modules/auth/jwt/jwt-auth.service';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UserService } from '@/modules/user/user.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { AccessTokenResponse, GithubUser } from './entities/github.entity';

@Injectable()
export class GithubService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly userService: UserService,
  ) {}

  public get login() {
    return 'login';
  }

  public async callback(code: string): Promise<string> {
    const accessTokenResponse = await this.accessToken(code);
    const profile = await this.profile(accessTokenResponse.access_token);

    const user = await this.userService.findOneByGithubId(profile.id);

    if (!user) {
      const createUserDto: CreateUserDto = {
        github_id: profile.id,
        username: profile.login,
        name: profile.name,
        email: profile.email,
        avatar_url: profile.avatar_url,
        github_token: accessTokenResponse.access_token,
      };

      const createdUser = await this.userService.create(createUserDto);

      const { accessToken } = this.jwtAuthService.login(createdUser);

      return accessToken;
    }

    await this.userService.updateByGithubId(profile.id, {
      github_token: accessTokenResponse.access_token,
    });

    const { accessToken } = this.jwtAuthService.login(user);

    return accessToken;
  }

  public get authorization() {
    const githubClientId = this.configService.get<string>(
      'auth.github.clientId',
    )!;
    // Erro, GithubApp não configurado.
    // const redirectUri = this.configService.get<string>(
    //   'auth.github.callbackURL',
    // )!;
    const githubState = this.configService.get<string>('auth.github.scope')!;

    const authorizationUrl = GITHUB_AUTHORIZATION_URL(
      githubClientId,
      githubState,
    );

    return { authorization_url: authorizationUrl };
  }

  private async accessToken(code: string) {
    const githubClientId = this.configService.get<string>(
      'auth.github.clientId',
    );
    const githubSecret = this.configService.get<string>(
      'auth.github.clientSecret',
    );
    const githubState = this.configService.get<string>('auth.github.scope');

    try {
      const response = await this.httpService.axiosRef.post(
        GITHUB_TOKEN_URL(),
        {
          client_id: githubClientId,
          client_secret: githubSecret,
          code,
          state: githubState,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const responseData =
        (await response.data) as unknown as AccessTokenResponse;

      return responseData;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error fetching access token:', error.response?.data);
        throw new Error(`Failed to fetch access token: ${error.message}`);
      }
      throw error;
    }
  }

  private async profile(accessToken: string) {
    try {
      const responseUser = await this.httpService.axiosRef.get(
        GITHUB_PROFILE_URL(),
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const responseUserData =
        (await responseUser.data) as unknown as GithubUser;

      return responseUserData;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error fetching profile:', error.response?.data);
        throw new Error(`Failed to fetch profile: ${error.message}`);
      }
      throw error;
    }
  }
}
