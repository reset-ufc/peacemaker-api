import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Suggestion, SuggestionSchema } from './entities/suggestion.entity';
import { SuggestionController } from './suggestion.controller';
import { SuggestionService } from './suggestion.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Suggestion.name,
        schema: SuggestionSchema,
      },
    ]),
  ],
  controllers: [SuggestionController],
  providers: [SuggestionService],
  exports: [SuggestionService],
})
export class SuggestionModule {}
