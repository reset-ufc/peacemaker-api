import { Comment } from '@/modules/comments/entities/comment.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type SuggestionDocument = Suggestion & Document;

@Schema()
export class Suggestion {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: Comment.name, required: true })
  comment_id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  gh_comment_id: string;

  @ApiProperty()
  @Prop({ required: true })
  content: string;

  @ApiProperty()
  @Prop({ default: false })
  is_edited: boolean;

  @ApiProperty()
  @Prop({ default: false })
  is_selected: boolean;

  @ApiProperty()
  @Prop({ default: Date.now })
  created_at: Date;
}

export const SuggestionSchema = SchemaFactory.createForClass(Suggestion);
