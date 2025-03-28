import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Suggestions, SuggestionsSchema } from './entities/suggestion.entity';
import { SuggestionsController } from './suggestions.controller';
import { SuggestionsService } from './suggestions.service';
import { Feedbacks, FeedbacksSchema } from './entities/feedback.entity';

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
  ],
  controllers: [SuggestionsController],
  providers: [SuggestionsService],
  exports: [SuggestionsService],
})
export class SuggestionsModule {}
