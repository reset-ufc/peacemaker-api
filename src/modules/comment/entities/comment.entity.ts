import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type CommentDocument = mongoose.Document;

@Schema()
export class Comment {
  @ApiProperty()
  @Prop()
  comment_or_pull_request_id: string;

  @ApiProperty()
  @Prop()
  content: string;

  @ApiProperty()
  @Prop()
  repository_id: number;

  @ApiProperty()
  @Prop()
  user_id: number;

  @ApiProperty()
  @Prop()
  toxicity: number;

  @ApiProperty()
  @Prop()
  classification: object;

  @ApiProperty()
  @Prop()
  suggestion_id: Array<string>;

  @ApiProperty()
  @Prop()
  solutioned: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
