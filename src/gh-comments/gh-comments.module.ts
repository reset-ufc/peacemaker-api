import { Module } from '@nestjs/common';
import { GhCommentsService } from './gh-comments.service';
import { GhCommentsController } from './gh-comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GhComment, GhCommentSchema } from './entities/gh-comment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GhComment.name,
        schema: GhCommentSchema,
      },
    ]),
  ],
  controllers: [GhCommentsController],
  providers: [GhCommentsService],
})
export class GhCommentsModule {}
