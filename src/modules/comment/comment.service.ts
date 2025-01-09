import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {}

  create(repositoryId: string, createCommentDto: CreateCommentDto) {
    const comment = new this.commentModel({
      ...createCommentDto,
      repository_id: repositoryId,
    });
    return comment.save();
  }

  findAll(repositoryId: string) {
    return this.commentModel.find({ repository_id: repositoryId });
  }

  findOne(id: string) {
    return this.commentModel.findOne({
      comment_or_pull_request_id: id,
    });
  }

  update(id: string, updateCommentDto: UpdateCommentDto) {
    return this.commentModel.findOneAndUpdate(
      { comment_or_pull_request_id: id },
      updateCommentDto,
    );
  }
}
