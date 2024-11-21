import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class AnalyticsCommentsService {
  constructor(
    @InjectModel('comments') private readonly commentModel: Model<any>,
  ) {}

  async getAverageScore(repoId: string) {
    const comments = await this.commentModel
      .find({ repositoryId: repoId })
      .lean()
      .exec();
    const totalScore = comments.reduce(
      (sum, comment) => sum + comment.score,
      0,
    );
    return { averageScore: totalScore / comments.length };
  }

  async getMedianScore(repoId: string) {
    const comments = await this.commentModel
      .find({ repositoryId: repoId })
      .exec();
    const scores = comments
      .map((comment) => comment.score)
      .sort((a, b) => a - b);
    const mid = Math.floor(scores.length / 2);
    const median =
      scores.length % 2 !== 0
        ? scores[mid]
        : (scores[mid - 1] + scores[mid]) / 2;
    return { medianScore: median };
  }

  async getTotalComments(repoId: string) {
    const totalComments = await this.commentModel
      .countDocuments({ repositoryId: repoId })
      .exec();
    return { totalComments };
  }

  async getResolvedComments(repoId: string) {
    const resolvedCount = await this.commentModel
      .countDocuments({ repositoryId: repoId, resolved: true })
      .exec();
    return { resolvedComments: resolvedCount };
  }

  async getRecentUsers(repoId: string) {
    const recentComments = await this.commentModel
      .find({ repositoryId: repoId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
      .exec();
    const recentUsers = [
      ...new Set(recentComments.map((comment) => comment.userId)),
    ];
    return { recentUsers };
  }

  async getDevelopersCount(repoId: string) {
    const developers = await this.commentModel
      .distinct('userId', { repositoryId: repoId })
      .exec();
    return { developersCount: developers.length };
  }

  async getClassificationCount(repoId: string) {
    const classifications = await this.commentModel
      .aggregate([
        { $match: { repositoryId: repoId } },
        { $group: { _id: '$classification', count: { $sum: 1 } } },
      ])
      .exec();
    return { classificationCount: classifications };
  }

  async getModerationTypes(repoId: string) {
    const moderationCounts = await this.commentModel
      .aggregate([
        { $match: { repositoryId: repoId } },
        { $group: { _id: '$moderation', count: { $sum: 1 } } },
      ])
      .exec();
    return { moderationTypes: moderationCounts };
  }

  async getLikesDislikesInsights(repoId: string) {
    const likes = await this.commentModel
      .aggregate([
        { $match: { repositoryId: repoId } },
        {
          $group: {
            _id: null,
            totalLikes: { $sum: '$likes' },
            totalDislikes: { $sum: '$dislikes' },
          },
        },
      ])
      .exec();
    return likes[0] || { totalLikes: 0, totalDislikes: 0 };
  }
}
