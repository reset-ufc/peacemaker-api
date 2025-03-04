import { IsBoolean, IsMongoId, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { Comment } from '../entities/comment.entity';
import { Categories, CommentType } from '../entities/enums';

export class CreateCommentDto extends Comment {
  @IsMongoId()
  readonly repository_id: Types.ObjectId;

  @IsMongoId()
  readonly user_id: Types.ObjectId;

  @IsString()
  readonly gh_comment_id: string;

  @IsString()
  readonly original_text: string;

  @IsNumber()
  readonly toxicity_score: number;

  @IsBoolean()
  readonly is_post_installation: boolean;

  @IsString()
  readonly classification: Categories;

  @IsString()
  readonly comment_type: CommentType;
}
