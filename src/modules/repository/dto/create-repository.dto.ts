import { Repository } from '@/modules/repository/entities/repository.entity';
import { IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateRepositoryDto extends Repository {
  @IsNumber()
  repository_id: number;

  @IsString()
  repository_name: string;

  @IsString()
  description: string;

  @IsString()
  github_html_url: string;

  @IsBoolean()
  is_private: boolean;

  @IsBoolean()
  is_fork: boolean;

  @IsBoolean()
  is_archived: boolean;

  @IsBoolean()
  is_disabled: boolean;

  @IsBoolean()
  is_template: boolean;

  @IsString()
  visibility: string;

  @IsObject()
  user_permissions: object;

  @IsNumber()
  user_id: number;
}
