import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { Repository, RepositorySchema } from './entities/repository.entity';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';

@Module({
  imports: [
    UsersModule,
    HttpModule,
    MongooseModule.forFeature([
      {
        name: Repository.name,
        schema: RepositorySchema,
      },
    ]),
  ],
  providers: [RepositoriesService],
  controllers: [RepositoriesController],
  exports: [RepositoriesService],
})
export class RepositoriesModule {}
