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
    const payload: JwtPayload = {
      sub: String(user.github_id),
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 semana
      user: {
        name: user.name,
        github_id: user.github_id,
      },
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
