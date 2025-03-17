import { Suggestion } from '@/modules/suggestions/entities/suggestion.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema()
export class Feedback {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: Suggestion.name, required: true })
  suggestion_id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  is_useful: boolean;

  @ApiProperty()
  @Prop({ required: false })
  justification?: string;

  @ApiProperty()
  @Prop({ default: Date.now })
  created_at: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
