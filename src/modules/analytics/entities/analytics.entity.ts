import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type AnalyticsDocument = mongoose.Document;

@Schema()
export class Analytics {
  @ApiProperty()
  @Prop()
  user_id: string;

  @ApiProperty()
  @Prop()
  average_score: number;

  @ApiProperty()
  @Prop()
  total_comments: number;

  @ApiProperty()
  @Prop()
  removed_comments: number;

  @ApiProperty()
  @Prop()
  absolute_comments: number;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
