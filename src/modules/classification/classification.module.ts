import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassificationController } from './classification.controller';
import { ClassificationService } from './classification.service';
import {
  Classification,
  ClassificationSchema,
} from './entities/classification.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Classification.name,
        schema: ClassificationSchema,
      },
    ]),
  ],
  controllers: [ClassificationController],
  providers: [ClassificationService],
  exports: [ClassificationService],
})
export class ClassificationModule {}
