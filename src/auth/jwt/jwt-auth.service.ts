import { User } from '@/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './entities/jwt.entity';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login(user: Pick<User, 'github_id' | 'name'>) {
    const { github_id: id, name } = user;

    const payload: JwtPayload = {
      sub: String(id),
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 semana
      name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
