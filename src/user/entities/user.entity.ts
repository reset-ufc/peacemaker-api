import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = mongoose.Document;

@Schema({
  toJSON: {
    getters: true,
  },
  timestamps: true,
})
export class User {
  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  github_id: number;

  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  node_id: string;

  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  login: string;

  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  avatar_url: string;

  @ApiProperty()
  @Prop({
    type: Boolean,
    required: true,
  })
  site_admin: boolean;

  @ApiProperty()
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @ApiProperty()
  @Prop({
    type: String,
    required: false,
  })
  email: string;

  @ApiProperty()
  @Prop({
    type: String,
    required: false,
  })
  github_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
