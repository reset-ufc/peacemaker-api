import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type SuggestionDocument = Suggestion & Document;

@Schema()
export class Suggestion {
  @ApiProperty()
  @Prop({ required: true })
  gh_comment_id: string;

  @ApiProperty()
  @Prop({ required: true })
  suggestions: Array<{
    content: string; // solução sugerida
  }>;

  @ApiProperty()
  @Prop({ default: false })
  is_edited: boolean;

  @ApiProperty()
  @Prop({ default: null })
  suggestion_selected_index: number;

  @ApiProperty()
  @Prop({ default: Date.now })
  created_at: Date;
}

export const SuggestionSchema = SchemaFactory.createForClass(Suggestion);
