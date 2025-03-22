import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export enum CommentType {
  ISSUE = 'issue',
  PULL_REQUEST = 'pull_request',
}

export type ParentsDocument = Parents & Document;

@Schema()
export class Parents {
  @ApiProperty()
  @Prop({ required: true, type: String, unique: true })
  comment_id: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  gh_parent_id: string;

  @ApiProperty()
  @Prop({ required: true, type: Number })
  gh_parent_number: number;

  @ApiProperty()
  @Prop({ required: true, type: String })
  title: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  html_url: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  is_open: string;

  @ApiProperty()
  @Prop({ required: true, type: Object.values(CommentType) })
  type: CommentType;

  @ApiProperty()
  @Prop({ required: true, type: Date })
  created_at: Date;
}

export const ParentsSchema = SchemaFactory.createForClass(Parents);
