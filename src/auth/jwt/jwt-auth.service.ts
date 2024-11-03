import { User } from '@/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './entities/jwt.entity';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login(user: User) {
    const { id, email, name } = user;
    const payload: JwtPayload = {
      sub: id!,
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
      name,
      email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
