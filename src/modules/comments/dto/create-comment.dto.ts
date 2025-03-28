import { Comments } from '@/modules/comments/entities/comment.entity';
import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto extends Comments {
  @IsString()
  gh_comment_id: string;

  @IsString()
  gh_repository_id: string;

  @IsString()
  gh_repository_name: string;

  @IsString()
  gh_repository_owner: string;

  @IsString()
  gh_comment_sender_id: string;

  @IsString()
  gh_comment_sender_login: string;

  @IsString()
  content: string;

  @IsString()
  event_type: string;

  @IsNumber()
  toxicity_score: number;

  @IsString()
  classification: string;

  @IsBoolean()
  solutioned: boolean;

  @IsString()
  suggestion_id: string;

  @IsString()
  comment_html_url: string;

  @IsString()
  issue_id: string;

  @IsDateString()
  created_at: Date;
}
