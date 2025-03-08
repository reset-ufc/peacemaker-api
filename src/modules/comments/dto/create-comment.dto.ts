import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { Comment } from '../entities/comment.entity';
import { CommentType } from '../entities/enums';

export class CreateCommentDto extends Comment {
  @IsString()
  gh_comment_id: string;

  @IsString()
  content: string;

  @IsDate()
  comment_created_at: Date;

  @IsString()
  author_id: string;

  @IsObject()
  parent: {
    type: CommentType;
    gh_parent_id: number;
    title: string;
    url: string;
  };

  @IsString()
  repository_fullname: string;

  @IsBoolean()
  is_repository_private: boolean;

  @IsString()
  repository_owner: string;

  @IsNumber()
  toxicity_score: number;

  @IsDate()
  toxicity_analyzed_at: Date;

  @IsBoolean()
  flagged: boolean;

  @IsString()
  classification: string;

  @IsBoolean()
  solutioned: boolean;

  @IsString()
  solution: string;

  @IsDate()
  solution_analyzed_at: Date;

  @IsMongoId()
  solution_id: Types.ObjectId;

  @IsString()
  event_type: string;

  @IsNumber()
  installation_id: number;

  @IsBoolean()
  moderated: boolean;

  @IsString()
  moderation_action: string;
}
