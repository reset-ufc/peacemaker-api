import { UserModule } from '@/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GhRepository, GhRepositorySchema } from './entities/gh-repository.entity';
import { GhRepositoriesController } from './gh-repositories.controller';
import { GhRepositoriesService } from './gh-repositories.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GhRepository.name,
        schema: GhRepositorySchema,
      },
    ]),
    UserModule,
    HttpModule,
  ],
  controllers: [GhRepositoriesController],
  providers: [GhRepositoriesService],
})
export class GhRepositoriesModule {}
