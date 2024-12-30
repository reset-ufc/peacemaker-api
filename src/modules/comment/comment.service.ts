import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {}

  create(createCommentDto: CreateCommentDto) {
    const comment = new this.commentModel(createCommentDto);
    return comment.save();
  }

  findAll() {
    return this.commentModel.find();
  }

  findOne(id: string) {
    return this.commentModel.findOne({ comment_or_pull_request_id: id });
  }
}
