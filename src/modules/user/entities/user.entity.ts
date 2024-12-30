import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type UserDocument = mongoose.Document;

@Schema()
export class User {
  @ApiProperty()
  @Prop()
  github_id: number;

  @ApiProperty()
  @Prop()
  username: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop()
  avatar_url: string;

  @ApiProperty()
  @Prop()
  github_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
