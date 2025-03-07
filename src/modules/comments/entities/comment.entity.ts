import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { CommentType } from './enums';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @ApiProperty()
  @Prop({ required: true, unique: true, type: String })
  gh_comment_id: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  content: string;

  @ApiProperty()
  @Prop({ required: true, type: Date })
  comment_created_at: Date;

  @ApiProperty()
  @Prop({ required: true, type: String })
  author_id: string;

  @ApiProperty()
  @Prop({ type: Object, required: true })
  parent: {
    type: CommentType;
    gh_parent_id: number;
    title: string;
    url: string;
  };

  @ApiProperty()
  @Prop({ required: true, type: String })
  repository_fullname: string;

  @ApiProperty()
  @Prop({ required: true, type: Boolean })
  is_repository_private: boolean;

  @ApiProperty()
  @Prop({ required: true, type: String })
  repository_owner: string;

  @ApiProperty()
  @Prop({ required: true, type: Number })
  toxicity_score: number;

  @ApiProperty()
  @Prop({ required: true, type: Date })
  toxicity_analyzed_at: Date;

  @ApiProperty()
  @Prop({ required: true, type: Boolean, default: false })
  flagged: boolean;

  @ApiProperty()
  @Prop({ required: true, type: String })
  classification: string;

  @ApiProperty()
  @Prop({ required: true, type: Boolean, default: false })
  solutioned: boolean;

  @ApiProperty()
  @Prop({ required: false, type: String, default: '' })
  solution: string;

  @ApiProperty()
  @Prop({ required: false, type: Date, default: null })
  solution_analyzed_at: Date;

  @ApiProperty()
  @Prop({ required: false, type: Types.ObjectId, default: null })
  solution_id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, type: String })
  event_type: string;

  @ApiProperty()
  @Prop({ required: true, type: Number })
  installation_id: number;

  @ApiProperty()
  @Prop({ required: true, type: Boolean })
  moderated: boolean;

  @ApiProperty()
  @Prop({ required: false, type: String })
  moderation_action: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
