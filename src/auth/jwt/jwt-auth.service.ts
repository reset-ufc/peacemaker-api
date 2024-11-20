import { User } from '@/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './entities/jwt.entity';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(user: User) {
    const payload: JwtPayload = {
      sub: String(user.github_id),
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 semana
      name: user.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
