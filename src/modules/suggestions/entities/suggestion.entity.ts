import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type SuggestionDocument = Suggestion & Document;

@Schema()
export class Suggestion {
  @ApiProperty()
  @Prop({ required: true })
  gh_comment_id: string;

  @ApiProperty({
    description: 'Array de sugestões com o conteúdo e flag de rejeição',
  })
  @Prop({
    required: true,
    type: [
      {
        content: { type: String, required: true },
        rejected: { type: Boolean, default: false },
      },
    ],
  })
  suggestions: Array<{
    content: string;
    rejected?: boolean;
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
  rejected: any;
}

export const SuggestionSchema = SchemaFactory.createForClass(Suggestion);
