import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type GhCommentDocument = mongoose.Document;

@Schema({
  toJSON: {
    getters: true,
  },
  timestamps: true,
})
export class GhComment {
  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  readonly comment_id: string;
  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  readonly github_id: string;
  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  readonly repo_id: string;
  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  readonly login: string;
  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  readonly repo_full_name: string;
  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  readonly comment: string;
  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  readonly classification: string;
  @ApiProperty()
  @Prop({
    type: Number,
    required: true,
  })
  readonly toxicity_score: number;

  @ApiProperty()
  @Prop({
    type: String,
    default: null,
    required: false,
  })
  readonly friendly_comment: string;

  @ApiProperty()
  @Prop({
    type: Boolean,
    default: false,
    required: false,
  })
  readonly solved: boolean;
}

export const GhCommentSchema = SchemaFactory.createForClass(GhComment);
