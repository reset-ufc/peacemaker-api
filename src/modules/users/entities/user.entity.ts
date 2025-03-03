import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty()
  @Prop({ required: true })
  github_id: string;

  @ApiProperty()
  @Prop({ required: false })
  email?: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  username: string;

  @ApiProperty()
  @Prop()
  avatar_url?: string;

  @ApiProperty()
  @Prop({ required: true })
  encrypted_token: string;

  @ApiProperty()
  @Prop({ required: false, default: 7 })
  threshold: number;

  @ApiProperty()
  @Prop({ required: false, default: 0 })
  temperature: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
