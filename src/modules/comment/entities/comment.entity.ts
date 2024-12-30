import { Classification } from '@/modules/classification/entities/classification.entity';
import { Repository } from '@/modules/repository/entities/repository.entity';
import { Suggestion } from '@/modules/suggestion/entities/suggestion.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type CommentDocument = mongoose.Document;

@Schema()
export class Comment {
  @ApiProperty()
  @Prop()
  comment_or_pull_request_id: string;

  @ApiProperty()
  @Prop()
  content: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Repository' })
  repository: Repository;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @ApiProperty()
  @Prop()
  toxicity: number;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Classification' })
  classification: Classification;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Suggestion' })
  suggestion: Suggestion;

  @ApiProperty()
  @Prop()
  solutioned: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
