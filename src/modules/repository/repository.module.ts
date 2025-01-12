import { UserModule } from '@/modules/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Repository, RepositorySchema } from './entities/repository.entity';
import { RepositoryController } from './repository.controller';
import { RepositoryService } from './repository.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Repository.name,
        schema: RepositorySchema,
      },
    ]),
    UserModule,
    HttpModule,
  ],
  controllers: [RepositoryController],
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class RepositoryModule {}
