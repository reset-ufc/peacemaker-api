import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type GhRepositoryDocument = mongoose.Document;

@Schema({
  toJSON: {
    getters: true,
  },
  timestamps: true,
})
export class GhRepository {
  @Prop({ required: true })
  @ApiProperty({ example: 'github-api' })
  name: string;

  @Prop({ required: true })
  @ApiProperty({ example: 'https://github.com/github-api/github-api' })
  url: string;
}

export const GhRepositorySchema = SchemaFactory.createForClass(GhRepository);
