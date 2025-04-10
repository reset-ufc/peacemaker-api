import { User, UserSchema } from '@/modules/users/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Suggestions,
  SuggestionsSchema,
} from '../suggestions/entities/suggestion.entity';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comments, CommentsSchema } from './entities/comment.entity';
import { Parents, ParentsSchema } from './entities/parent.entity';

@Module({
  imports: [
    HttpModule,
    SuggestionsModule,
    MongooseModule.forFeature([
      {
        name: Comments.name,
        schema: CommentsSchema,
      },
      {
        name: Parents.name,
        schema: ParentsSchema,
      },
      {
        name: Suggestions.name,
        schema: SuggestionsSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
