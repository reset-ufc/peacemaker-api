import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

// Table users {
//   gh_user_id            string  [note: "Identificador referente ao id do usuário no GitHub"]
//   username         string
//   name             string
//   email            string
//   avatar_url       string
//   encripted_token  string
//   created_at       datetime
// }

@Schema()
export class User {
  @ApiProperty()
  @Prop({ required: true })
  gh_user_id: string;

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
  @Prop({
    required: true,
    default: Date.now,
  })
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
