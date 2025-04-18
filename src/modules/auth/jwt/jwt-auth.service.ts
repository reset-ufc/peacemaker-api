import { User } from '@/modules/users/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './entities/jwt.entity';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  login(user: User) {
    const nowInSeconds = Math.floor(Date.now() / 1000);

    const payload: JwtPayload = {
      sub: user.gh_user_id,
      iat: nowInSeconds,
      exp: nowInSeconds + 60 * 60 * 24, // 1 dia em segundos
      user: {
        github_id: user.gh_user_id,
        name: user.name,
        username: user.username,
        avatar_url: user.avatar_url!,
        email: user.email || '',
      },
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
