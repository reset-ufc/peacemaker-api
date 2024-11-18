import { AppConfig } from '@/config/interfaces/app-config';
import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(GithubOauthStrategy.name);

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
      nodeId: profile.nodeId,
      displayName: profile.displayName || profile.username || '',
      username: profile.username,
      profileUrl: profile.profileUrl,
      photos: profile.photos?.map((photo) => ({ value: photo.value })) || [],
      createdAt: new Date(), // Opcional, pode ser ajustado
      updateAt: new Date(), // Opcional, pode ser ajustado
      accessToken, // Incluímos o token de acesso para uso posterior
    };
  
    // Validação com o schema do Zod para garantir consistência
    //const validatedUser = userSchema.parse(user);
  
    return user;
  }
}
