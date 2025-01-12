import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type ClassificationDocument = mongoose.Document;

export enum Sentiment {
  bitter_frustration = 'bitter_frustration',
  mocking = 'mocking',
  irony = 'irony',
  insulting = 'insulting',
  vulgarity = 'vulgarity',
  identity_attack = 'identity_attack',
  entitlement = 'entitlement',
  impatience = 'impatience',
  threat = 'threat',
  neutral = 'neutral',
}

@Schema()
export class Classification {
  @ApiProperty()
  @Prop()
  content: string;

  @ApiProperty()
  @Prop()
  sentiment: Sentiment;
}

export const ClassificationSchema =
  SchemaFactory.createForClass(Classification);
