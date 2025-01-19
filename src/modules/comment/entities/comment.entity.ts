import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type CommentDocument = mongoose.Document;

export type Suggestions = {
  corrected_comment: string;
};

@Schema()
export class Comment {
  @ApiProperty()
  @Prop()
  comment_id: string;

  @ApiProperty()
  @Prop()
  user_id: string;

  @ApiProperty()
  @Prop()
  repository_id: string;

  @ApiProperty()
  @Prop()
  login: string;

  @ApiProperty()
  @Prop()
  repo_full_name: string;

  @ApiProperty()
  @Prop()
  created_at: string;

  @ApiProperty()
  @Prop()
  content: string;

  @ApiProperty()
  @Prop()
  toxicity: string;

  @ApiProperty()
  @Prop({ type: Object })
  suggestions: object;

  @ApiProperty()
  @Prop()
  classification: string;

  @ApiProperty()
  @Prop()
  solutioned: boolean;

  @ApiProperty()
  @Prop()
  solution: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
