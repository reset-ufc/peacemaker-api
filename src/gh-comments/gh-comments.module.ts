import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GhComment, GhCommentSchema } from './entities/gh-comment.entity';
import { GhCommentsController } from './gh-comments.controller';
import { GhCommentsService } from './gh-comments.service';

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
