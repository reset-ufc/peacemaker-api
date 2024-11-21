import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { AnalyticsCommentsController } from './analytics-comments.controller';
import { AnalyticsCommentsService } from './analytics-comments.service';

const CommentSchema = new Schema(
  {
    repositoryId: String,
    userId: String,
    score: Number,
    resolved: Boolean,
    classification: String,
    moderation: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'comments', schema: CommentSchema }]),
  ],
  controllers: [AnalyticsCommentsController],
  providers: [AnalyticsCommentsService],
})
export class AnalyticsCommentsModule {}
