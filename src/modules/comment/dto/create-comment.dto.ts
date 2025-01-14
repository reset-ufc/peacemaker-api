import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { Comment } from '../entities/comment.entity';

export class CreateCommentDto extends Comment {
  @IsString()
  comment_or_pull_request_id: string;

  @IsString()
  content: string;

  @IsObject()
  classification: object;

  @IsNumber()
  repository_id: number;

  @IsBoolean()
  solutioned: boolean;

  @IsArray()
  suggestion_id: Array<string>;

  @IsNumber()
  toxicity: number;

  @IsNumber()
  user_id: number;
}
