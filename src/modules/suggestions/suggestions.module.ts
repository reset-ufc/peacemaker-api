import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from '../comments/comments.module';
import { Feedbacks, FeedbacksSchema } from './entities/feedback.entity';
import { Suggestions, SuggestionsSchema } from './entities/suggestion.entity';
import { SuggestionsController } from './suggestions.controller';
import { SuggestionsService } from './suggestions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Suggestions.name,
        schema: SuggestionsSchema,
      },
      {
        name: Feedbacks.name,
        schema: FeedbacksSchema,
      },
    ]),
    forwardRef(() => CommentsModule),
  ],
  controllers: [SuggestionsController],
  providers: [SuggestionsService],
  exports: [SuggestionsService],
})
export class SuggestionsModule {}
