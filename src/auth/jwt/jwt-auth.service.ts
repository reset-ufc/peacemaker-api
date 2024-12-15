import { User } from '@/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './entities/jwt.entity';
import { UnauthorizedException } from '@nestjs/common';

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
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
