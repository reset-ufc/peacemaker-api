import { Comment } from '@/modules/comment/entities/comment.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type SuggestionDocument = mongoose.Document;

@Schema()
export class Suggestion {
  @ApiProperty()
  @Prop()
  content: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  comment_id: Comment;

  @ApiProperty()
  @Prop()
  likes: number;

  @ApiProperty()
  @Prop()
  dislikes: number;

  @ApiProperty()
  @Prop()
  reports: number;
}

export const SuggestionSchema = SchemaFactory.createForClass(Suggestion);
