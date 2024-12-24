import { Module } from '@nestjs/common';
import { GhRepositoriesService } from './gh-repositories.service';
import { GhRepositoriesController } from './gh-repositories.controller';

@Module({
  controllers: [GhRepositoriesController],
  providers: [GhRepositoriesService],
})
export class GhRepositoriesModule {}
