import { IsBoolean, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { Repository } from '../entities/repository.entity';

export class CreateRepositoryDto extends Repository {
  readonly user_id: ObjectId;

  @IsString()
  readonly gh_repository_id: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly repo_fullname: string;

  @IsString()
  readonly url: string;

  @IsBoolean()
  readonly is_private: boolean;
}
