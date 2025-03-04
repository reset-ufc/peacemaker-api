import { IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto extends User {
  @IsString({ message: 'The Github ID is required' })
  github_id: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString({ message: 'The name is required' })
  name: string;

  @IsString({ message: 'The username is required' })
  username: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;

  @IsString({ message: 'The Github token is required' })
  encrypted_token: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  threshold: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  temperature: number;
}
