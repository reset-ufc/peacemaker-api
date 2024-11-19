import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GhComment, GhCommentDocument } from './entities/gh-comment.entity';
import { CreateGhCommentDto } from './dto/create-gh-comment.dto';
import { UpdateGhCommentDto } from './dto/update-gh-comment.dto';

@Injectable()
export class GhCommentsService {
  constructor(
    @InjectModel(GhComment.name)
    private readonly ghCommentModel: Model<GhCommentDocument>,
  ) {}
  create(createGhCommentDto: CreateGhCommentDto) {
    return this.ghCommentModel.create(createGhCommentDto);
  }

  findAll() {
    return this.ghCommentModel.find().exec();
  }

  findOne(id: string) {
    return this.ghCommentModel.findOne({ _id: id }).exec();
  }

  update(id: string, updateGhCommentDto: UpdateGhCommentDto) {
    return this.ghCommentModel
      .findOneAndUpdate({ _id: id }, updateGhCommentDto)
      .exec();
  }

  remove(id: string) {
    return this.ghCommentModel.findOneAndDelete({ _id: id }).exec();
  }
}
