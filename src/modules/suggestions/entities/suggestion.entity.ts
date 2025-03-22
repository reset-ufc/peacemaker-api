import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type SuggestionsDocument = Suggestions & Document;

@Schema()
export class Suggestions {
  @ApiProperty()
  @Prop({ required: true, type: String })
  gh_comment_id: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  content: string;

  @ApiProperty()
  @Prop({ required: true, type: Boolean, default: false })
  is_edited: boolean;

  @ApiProperty()
  @Prop({ required: true, type: Date })
  created_at: Date;
}

export const SuggestionsSchema = SchemaFactory.createForClass(Suggestions);
