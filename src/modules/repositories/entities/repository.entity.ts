import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type RepositoryDocument = Repository & Document;

@Schema()
export class Repository {
  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  gh_repository_id: string;

  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  gh_repo_fullname: string;

  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  gh_url: string;

  @ApiProperty({ type: Boolean })
  @Prop({ type: Boolean, required: true })
  private: boolean;

  @ApiProperty({ type: String })
  @Prop({ type: String, required: true })
  owner_gh_id: string;

  @ApiProperty({ type: Date })
  @Prop({ type: Date, required: true })
  created_at: Date;
}

export const RepositorySchema = SchemaFactory.createForClass(Repository);
