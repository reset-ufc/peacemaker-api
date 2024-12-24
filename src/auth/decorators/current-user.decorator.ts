import { User } from '@/user/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';

export interface AuthRequest extends Request {
  user: User;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  },
);
