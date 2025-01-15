import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { Comment } from '../entities/comment.entity';

export class CreateCommentDto extends Comment {
  @IsString()
  comment_or_pull_request_id: string;

  @IsString()
  content: string;

  @IsString()
  classification: string;

  @IsNumber()
  repository_id: number;

  @IsBoolean()
  solutioned: boolean;

  @IsArray()
  suggestion: Array<string>;

  @IsNumber()
  toxicity: number;

  @IsNumber()
  user_id: number;
}
