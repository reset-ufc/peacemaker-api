import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyticsDocument = Analytics & Document;

@Schema()
export class Analytics {
  @Prop()
  user_id: string;

  @Prop()
  average_score: number;

  @Prop()
  total_comments: number;

  @Prop()
  removed_comments: number;

  @Prop()
  absolute_comments: number;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
