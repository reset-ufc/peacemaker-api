import { IsBoolean, IsDate, IsString } from 'class-validator';
import { Repository } from '../entities/repository.entity';

export class CreateRepositoryDto extends Repository {
  @IsString()
  name: string;

  @IsString()
  gh_repository_id: string;

  @IsString()
  gh_repo_fullname: string;

  @IsString()
  gh_url: string;

  @IsBoolean()
  private: boolean;

  @IsString()
  owner_gh_id: string;

  @IsDate()
  created_at: Date;
}
