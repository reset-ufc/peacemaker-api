import { Repository } from '@/modules/repositories/entities/repository.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { Categories, CommentType } from './enums';

export type CommentDocument = Comment & Document;

// The GithubApp don't have access to the repository and user informations like the repository_id on ObjectId

@Schema()
export class Comment {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: Repository.name, required: true })
  repository_id: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user_id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  gh_comment_id: string;

  @ApiProperty()
  @Prop({ required: true })
  repo_full_name: string;

  @ApiProperty()
  @Prop({ required: true })
  original_text: string;

  @ApiProperty()
  @Prop({ required: true })
  toxicity_score: number;

  @ApiProperty()
  @Prop({ required: true })
  is_post_installation: boolean;

  @ApiProperty()
  @Prop({ required: true, enum: Categories })
  classification: Categories;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Suggestion' })
  selected_suggestion_id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, enum: CommentType })
  comment_type: CommentType;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
