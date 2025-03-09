import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Suggestion,
  SuggestionSchema,
} from '../suggestions/entities/suggestion.entity';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment, CommentSchema } from './entities/comment.entity';

@Module({
  imports: [
    SuggestionsModule,
    HttpModule,
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: Suggestion.name,
        schema: SuggestionSchema,
      },
    ]),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
