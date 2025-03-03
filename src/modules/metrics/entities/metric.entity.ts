import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type MetricDocument = Metric & Document;

@Schema()
export class Metric {
  @ApiProperty()
  @Prop({ required: true })
  suggestions_fully_accepted: number;

  @ApiProperty()
  @Prop({ required: true })
  suggestions_partial_accepted: number;

  @ApiProperty()
  @Prop({ required: true })
  suggestions_not_accepted: number;

  @ApiProperty()
  @Prop({ required: true })
  suggestions_by_owner: number;

  @ApiProperty()
  @Prop({ default: Date.now })
  recorded_at: Date;
}

export const MetricSchema = SchemaFactory.createForClass(Metric);
