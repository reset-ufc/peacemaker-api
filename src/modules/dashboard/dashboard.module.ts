// src/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentsSchema } from '../comments/entities/comment.entity';
import {
  Feedbacks,
  FeedbacksSchema,
} from '../suggestions/entities/feedback.entity';
import {
  Suggestions,
  SuggestionsSchema,
} from '../suggestions/entities/suggestion.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
      { name: Suggestions.name, schema: SuggestionsSchema },
      { name: Feedbacks.name, schema: FeedbacksSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
