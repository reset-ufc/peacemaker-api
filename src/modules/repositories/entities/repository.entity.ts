import { User } from '@/modules/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, ObjectId, Types } from 'mongoose';

export type RepositoryDocument = Repository & Document;

@Schema()
export class Repository {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user_id: ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  gh_user_id: string;

  @ApiProperty()
  @Prop({ required: true })
  gh_repository_id: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  repo_fullname: string;

  @ApiProperty()
  @Prop({ required: true })
  url: string;

  @ApiProperty()
  @Prop({ required: true })
  is_private: boolean;

  @ApiProperty()
  @Prop({ default: Date.now })
  created_at: Date;

  @ApiProperty()
  @Prop({ default: Date.now })
  updated_at: Date;
}

export const RepositorySchema = SchemaFactory.createForClass(Repository);
