import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Classification } from './entities/classification.entity';

@Injectable()
export class ClassificationService {
  constructor(
    @InjectModel(Classification.name)
    private readonly classificationModel: Model<Classification>,
  ) {}

  create(classification: Classification) {
    const classificationModel = new this.classificationModel(classification);
    return classificationModel.save();
  }

  findAll() {
    return this.classificationModel.find();
  }

  findOne(id: string) {
    return this.classificationModel.findOne({ _id: id });
  }

  generateClassification() {
    return 'generate classification';
  }
}
