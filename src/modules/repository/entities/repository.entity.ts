import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type RepositoryDocument = mongoose.Document;

@Schema()
export class Repository {
  @ApiProperty()
  @Prop()
  repository_id: string;

  @ApiProperty()
  @Prop()
  repository_name: string;

  @ApiProperty()
  @Prop()
  repository_full_name: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop()
  github_html_url: string;

  @ApiProperty()
  @Prop()
  is_private: boolean;

  @ApiProperty()
  @Prop()
  is_fork: boolean;

  @ApiProperty()
  @Prop()
  is_archived: boolean;

  @ApiProperty()
  @Prop()
  is_disabled: boolean;

  @ApiProperty()
  @Prop()
  is_template: boolean;

  @ApiProperty()
  @Prop()
  visibility: string;

  @ApiProperty()
  @Prop({ type: Object, required: true })
  user_permissions: object;

  @ApiProperty()
  @Prop()
  user_id: number;
}

export const RepositorySchema = SchemaFactory.createForClass(Repository);
