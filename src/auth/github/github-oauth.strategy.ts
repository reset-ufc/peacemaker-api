import { AppConfig } from '@/config/interfaces/app-config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  Strategy,
  StrategyOptionsWithRequest,
} from 'passport-github2';
import { UserService } from '@/user/user.service';

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService<AppConfig>,
    private usersService: UserService,
  ) {
    super({
      clientID: configService.get<string>('auth.github.clientId'),
      clientSecret: configService.get<string>('auth.github.clientSecret'),
      callbackURL: configService.get<string>('auth.github.callbackURL'),
      scope: ['repo,user:email'],
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    const user = {
      id: profile.id,
      displayName: profile.displayName,
      username: profile.username,
      profileUrl: profile.profileUrl,
      photos: profile.photos?.[0].value,
      accessToken,
    };

    return user;
  }
}
