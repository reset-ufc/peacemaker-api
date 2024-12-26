import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateGhCommentDto } from './dto/create-gh-comment.dto';
import { UpdateGhCommentDto } from './dto/update-gh-comment.dto';
import { GhComment } from './entities/gh-comment.entity';

@Injectable()
export class GhCommentsService {
  constructor(
    @InjectModel(GhComment.name)
    private readonly ghCommentModel: Model<GhComment>,
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
    return this.ghCommentModel.findOneAndUpdate({ _id: id }, updateGhCommentDto).exec();
  }

  remove(id: string) {
    return this.ghCommentModel.findOneAndDelete({ _id: id }).exec();
  }

  async getAverageScore(repository_id: string) {
    const comments = await this.ghCommentModel.find({ repo_id: repository_id }).exec();

    const totalScore = comments.reduce((sum, comment) => sum + comment.toxicity_score, 0);

    return totalScore / comments.length;
  }

  async getMedianScore(repository_id: string) {
    const comments = await this.ghCommentModel.find({ repo_id: repository_id }).exec();
    const scores = comments.map((comment) => comment.toxicity_score).sort((a, b) => a - b);

    const mid = Math.floor(scores.length / 2);

    const median = scores.length % 2 !== 0 ? scores[mid] : (scores[mid - 1] + scores[mid]) / 2;

    return median;
  }

  async getTotalComments(repository_id: string) {
    const totalComments = await this.ghCommentModel
      .countDocuments({ repo_id: repository_id })
      .exec();

    return totalComments;
  }

  async getResolvedComments(repository_id: string) {
    const resolvedCount = await this.ghCommentModel
      .countDocuments({ repo_id: repository_id, resolved: true })
      .exec();

    return resolvedCount;
  }

  async getRecentUsers(repository_id: string) {
    const recentComments = await this.ghCommentModel
      .find({ repo_id: repository_id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
      .exec();

    const recentUsers = [...new Set(recentComments.map((comment) => comment.github_id))];

    return recentUsers;
  }

  async getDevelopersCount(repository_id: string) {
    const developers = await this.ghCommentModel
      .distinct('userId', { repo_id: repository_id })
      .exec();

    return { developersCount: developers.length };
  }

  async getClassificationCount(repository_id: string) {
    const classifications = await this.ghCommentModel
      .aggregate([
        { $match: { repo_id: repository_id } },
        { $group: { _id: '$classification', count: { $sum: 1 } } },
      ])
      .exec();

    return classifications;
  }

  async getModerationTypes(repository_id: string) {
    const moderationCounts = await this.ghCommentModel
      .aggregate([
        { $match: { repo_id: repository_id } },
        { $group: { _id: '$moderation', count: { $sum: 1 } } },
      ])
      .exec();

    return moderationCounts;
  }

  async getLikesDislikesInsights(repository_id: string) {
    const likes = await this.ghCommentModel
      .aggregate([
        { $match: { repo_id: repository_id } },
        {
          $group: {
            _id: null,
            totalLikes: { $sum: '$likes' },
            totalDislikes: { $sum: '$dislikes' },
          },
        },
      ])
      .exec();

    return likes;
  }
}
