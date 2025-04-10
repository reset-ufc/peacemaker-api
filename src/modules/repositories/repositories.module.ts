import { GithubModule } from '@/modules/auth/oauth/github/github.module';
import {
  Comments,
  CommentsSchema,
} from '@/modules/comments/entities/comment.entity';
import {
  Parents,
  ParentsSchema,
} from '@/modules/comments/entities/parent.entity';
import { UsersModule } from '@/modules/users/users.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Repository, RepositorySchema } from './entities/repository.entity';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';

@Module({
  imports: [
    UsersModule,
    HttpModule,
    GithubModule,
    MongooseModule.forFeature([
      {
        name: Repository.name,
        schema: RepositorySchema,
      },
      {
        name: Comments.name,
        schema: CommentsSchema,
      },
      {
        name: Parents.name,
        schema: ParentsSchema,
      },
    ]),
  ],
  providers: [RepositoriesService],
  controllers: [RepositoriesController],
  exports: [RepositoriesService],
})
export class RepositoriesModule {}
