import { User } from '@/user/entities/user.entity';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: User;
}
