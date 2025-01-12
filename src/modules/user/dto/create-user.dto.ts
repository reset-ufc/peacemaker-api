import { User } from '@/modules/user/entities/user.entity';
import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto extends User {
  @IsNumber()
  github_id: number;

  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  avatar_url: string;

  @IsString()
  github_token: string;
}
