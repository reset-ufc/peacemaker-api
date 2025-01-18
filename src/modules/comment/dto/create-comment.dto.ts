import { IsBoolean, IsObject, IsString } from 'class-validator';
import { Comment } from '../entities/comment.entity';

export class CreateCommentDto extends Comment {
  @IsString()
  comment_id: string;

  @IsString()
  user_id: string;

  @IsString()
  @IsString()
  repository_id: string;

  @IsString()
  login: string;

  @IsString()
  repo_full_name: string;

  @IsString()
  created_at: string;

  @IsString()
  content: string;

  @IsString()
  toxicity: string;

  @IsObject()
  suggestions: object;

  @IsString()
  classification: string;

  @IsBoolean()
  solutioned: boolean;

  @IsString()
  solution: string;
}
