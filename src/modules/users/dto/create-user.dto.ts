import { User } from '@/modules/users/entities/user.entity';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateUserDto extends User {
  @IsString({ message: 'The Github ID is required' })
  gh_user_id: string;

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

  @IsOptional()
  @IsString({ message: 'The Githubtoken is required' })
  encrypted_token: string;

  @IsDate()
  created_at: Date;
}
