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
  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  readonly repository_id: string;
  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  readonly repository_name: string;
  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  readonly repository_full_name: string;
  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  readonly permissions: string;
  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  readonly user_id: string;
}

export const GhRepositorySchema = SchemaFactory.createForClass(GhRepository);
