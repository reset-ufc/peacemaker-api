import { JwtAuthService } from '@/modules/auth/jwt/jwt-auth.service';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UsersService } from '@/modules/users/users.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { GithubUser } from './entities/github.entity';

@Injectable()
export class GithubService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly userService: UsersService,
  ) {}

  public async callback(code: string): Promise<string> {
    const accessTokenResponse = await this.accessToken(code);
    const profile = await this.profile(accessTokenResponse);
    const user = await this.userService.findOneByGithubId(String(profile.id));
    // const encryptedToken = encryptToken(accessTokenResponse.access_token);
    if (!user) {
      const createUserDto: CreateUserDto = {
        gh_user_id: String(profile.id),
        email: profile.email,
        name: profile.name,
        username: profile.login,
        avatar_url: profile.avatar_url,
        encrypted_token: accessTokenResponse,
        created_at: new Date(),
      };

      const createdUser = await this.userService.create(createUserDto);

      const { accessToken } = this.jwtAuthService.login(createdUser);

      return accessToken;
    }

    // await this.userService.updateByGithubId(String(profile.id), {
    //   encrypted_token: encryptedToken,
    // });

    const token = this.jwtAuthService.login(user);

    return token.accessToken;
  }

  public authorization(state: string) {
    const githubClientId = this.configService.get<string>(
      'auth.github.clientId',
    )!;
    // Erro, GithubApp não configurado.
    const redirectUri = this.configService.get<string>(
      'auth.github.callbackURL',
    )!;

    const githubScope = encodeURIComponent(
      this.configService.get<string>('auth.github.scope')!,
    );

    return `https://github.com/login/oauth/authorize?client_id=${githubClientId}&response_type=code&scope=${githubScope}&redirect_uri=${redirectUri}&state=${state}`;
  }

  private async accessToken(code: string) {
    // const githubClientId = this.configService.get<string>(
    //   'auth.github.clientId',
    // );
    // const githubSecret = this.configService.get<string>(
    //   'auth.github.clientSecret',
    // );
    // const githubScope = this.configService.get<string>('auth.github.scope');

    // try {
    //   const response = await this.httpService.axiosRef.post(
    //     'https://github.com/login/oauth/access_token',
    //     {
    //       client_id: githubClientId,
    //       client_secret: githubSecret,
    //       code,
    //       scope: githubScope,
    //     },
    //     {
    //       headers: {
    //         Accept: 'application/json',
    //       },
    //     },
    //   );

    //   const responseData =
    //     (await response.data) as unknown as AccessTokenResponse;

    //   return responseData;
    try {
      const personalAccessToken = this.configService.get<string>(
        'auth.github.personalAccessToken',
      );

      if (!personalAccessToken) {
        throw new Error('GitHub personal access token is not configured.');
      }

      return personalAccessToken;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error fetching access token:', error.response?.data);
        throw new Error(`Failed to fetch access token: ${error.message}`);
      }

      console.error('Unexpected error fetching access token:', error);
      throw new Error(
        'An unexpected error occurred while fetching the access token.',
      );
    }
  }

  private async profile(accessToken: string) {
    try {
      const responseUser = await this.httpService.axiosRef.get(
        'https://api.github.com/user',
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
