import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../comment/entities/comment.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  private async getComments(userId: number, repositoryId: string) {
    return this.commentModel
      .find({ user_id: userId, repository_id: repositoryId, removed: false })
      .exec();
  }

  async calculateAverageScore(userId: number, repositoryId: string) {
    const comments = await this.getComments(userId, repositoryId);

    if (comments.length === 0) {
      return 0;
    }

    const totalScore = comments.reduce(
      (sum, comment) => sum + (comment.score || 0),
      0,
    );

    return (totalScore / comments.length) * 100;
  }

  async getTotalComments(userId: number, repositoryId: string) {
    return this.commentModel
      .countDocuments({ user_id: userId, repository_id: repositoryId })
      .exec();
  }

  async countRemovedComments(userId: number, repositoryId: string) {
    return this.commentModel
      .countDocuments({
        user_id: userId,
        repository_id: repositoryId,
        removed: true,
      })
      .exec();
  }

  async countAbsoluteComments(userId: number, repositoryId: string) {
    const comments = await this.getComments(userId, repositoryId);
    return comments.length;
  }

  async getIncivilityTypes(userId: number, repositoryId: string) {
    const comments = await this.getComments(userId, repositoryId);

    const incivilityCount: Record<string, number> = {};

    comments.forEach(comment => {
      if (comment.classification) {
        incivilityCount[comment.classification] =
          (incivilityCount[comment.classification] || 0) + 1;
      }
    });

    return incivilityCount;
  }
}
