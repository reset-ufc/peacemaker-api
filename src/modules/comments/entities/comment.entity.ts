import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type CommentsDocument = Comments & Document;

@Schema()
export class Comments {
  @ApiProperty()
  @Prop({ required: true, type: String })
  gh_comment_id: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  gh_repository_id: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  gh_repository_name: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  gh_repository_owner: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  gh_comment_sender_id: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  gh_comment_sender_login: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  content: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  event_type: string;

  @ApiProperty()
  @Prop({ required: true, type: Number })
  toxicity_score: number;

  @ApiProperty()
  @Prop({ required: true, type: String })
  classification: string;

  @ApiProperty()
  @Prop({ required: true, type: Boolean })
  solutioned: boolean;

  @ApiProperty()
  @Prop({ required: true, type: String })
  suggestion_id: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  comment_html_url: string;

  @ApiProperty()
  @Prop({ required: true, type: Number })
  editAttempts: number;

  @ApiProperty({ enum: ['pull_request', 'issue'] })
  @Prop({ required: true, type: String, enum: ['pull_request', 'issue'] })
  parentType: string;

  @ApiProperty()
  @Prop({ required: true, type: Boolean })
  needsAttention: boolean;

  @ApiProperty()
  @Prop({ required: true, type: String })
  issue_id: string;

  @ApiProperty()
  @Prop({ required: true, type: Date })
  created_at: Date;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
