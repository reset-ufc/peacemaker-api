// src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Comments,
  CommentsDocument,
} from '../comments/entities/comment.entity';
import {
  Feedbacks,
  FeedbacksDocument,
} from '../suggestions/entities/feedback.entity';
import {
  Suggestions,
  SuggestionsDocument,
} from '../suggestions/entities/suggestion.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Comments.name)
    private readonly commentsModel: Model<CommentsDocument>,
    @InjectModel(Suggestions.name)
    private readonly suggestionsModel: Model<SuggestionsDocument>,
    @InjectModel(Feedbacks.name)
    private readonly feedbacksModel: Model<FeedbacksDocument>,
  ) {}

  calculateStartDate(period: string): Date {
    let periodMs = 24 * 60 * 60 * 1000;
    if (period === '7d') periodMs = 7 * 24 * 60 * 60 * 1000;
    else if (period === '30d') periodMs = 30 * 24 * 60 * 60 * 1000;
    else if (period === '1y') periodMs = 365 * 24 * 60 * 60 * 1000;
    return new Date(Date.now() - periodMs);
  }

  private buildFilter(startDate: Date, repo?: string): Record<string, any> {
    const filter: any = { created_at: { $gte: startDate } };
    if (repo && repo !== 'all') {
      filter.gh_repository_id = repo;
    }
    return filter;
  }

  async getOverviewMetrics(period: string, repo?: string): Promise<any> {
    const startDate = this.calculateStartDate(period);
    const filter: Record<string, any> = this.buildFilter(startDate, repo);

    const totalComments = await this.commentsModel.countDocuments(filter);
    const flaggedComments = await this.commentsModel.countDocuments({
      ...filter,
      toxicity_score: { $gte: 0.6 },
    });
    const acceptedSuggestionsCount = await this.commentsModel.countDocuments({
      ...filter,
      solutioned: true,
      suggestion_id: { $ne: null },
    });
    const refusedSuggestions = await this.suggestionsModel.countDocuments({
      ...filter,
      is_rejected: true,
    });
    const resolvedComments = await this.commentsModel.countDocuments({
      ...filter,
      solutioned: true,
    });
    const {
      medianCommentScore,
      averageCommentScore,
    }: { medianCommentScore: number; averageCommentScore: number } =
      await this.getCommentScores(startDate, repo);

    return {
      averageCommentScore: averageCommentScore,
      medianCommentScore: medianCommentScore,
      totalComments,
      resolvedComments,
      flaggedComments,
      acceptedSuggestionsCount,
      refusedSuggestions,
    };
  }

  private async getCommentScores(startDate: Date, repo?: string) {
    const filter = this.buildFilter(startDate, repo);

    const averageScoreAgg = await this.commentsModel.aggregate([
      { $match: filter },
      { $group: { _id: null, average: { $avg: '$toxicity_score' } } },
      { $project: { _id: 0, average: { $round: ['$average', 2] } } },
    ]);
    const averageScore = averageScoreAgg.length
      ? averageScoreAgg[0].average
      : 0;

    const scoresDocs = await this.commentsModel
      .find(filter, { toxicity_score: 1, _id: 0 })
      .sort({ toxicity_score: 1 })
      .lean();
    const scores = scoresDocs.map(doc => doc.toxicity_score);

    let medianScore = 0;
    if (scores.length) {
      const mid = Math.floor(scores.length / 2);
      if (scores.length % 2 === 0) {
        medianScore = (scores[mid - 1] + scores[mid]) / 2;
      } else {
        medianScore = scores[mid];
      }
      medianScore = Math.round(medianScore * 100) / 100;
    }

    return {
      medianCommentScore: medianScore,
      averageCommentScore: averageScore,
    };
  }

  async getModerationActivity(startDate: Date, repo?: string): Promise<any[]> {
    const filter = this.buildFilter(startDate, repo);
    const moderationActivityAgg = await this.commentsModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%b', date: '$created_at' } },
          comments: { $sum: 1 },
          flags: {
            $sum: { $cond: [{ $gte: ['$toxicity_score', 0.8] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return moderationActivityAgg.map(
      (item: { _id: string; comments: number; flags: number }) => ({
        month: item._id,
        comments: item.comments,
        flags: item.flags,
      }),
    );
  }

  async getRecentFlagged(startDate: Date, repo?: string): Promise<any[]> {
    const filter = this.buildFilter(startDate, repo);
    const recentFlaggedDocs = await this.commentsModel
      .find({ ...filter, toxicity_score: { $gte: 0.6 } })
      .sort({ created_at: -1 })
      .lean();
    return recentFlaggedDocs.map(doc => {
      let severity = 'Medium';
      if (doc.toxicity_score >= 0.9) severity = 'High';
      return {
        author: doc.gh_comment_sender_login,
        severity,
        action: severity === 'High' ? 'Review' : 'Mute',
        comment_html_url: doc.comment_html_url,
      };
    });
  }

  async getRadarFlags(startDate: Date, repo?: string): Promise<any[]> {
    const filter = this.buildFilter(startDate, repo);
    const classificationDataAgg = await this.commentsModel.aggregate([
      { $match: filter },
      { $group: { _id: '$classification', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
    return classificationDataAgg.map((c: { _id: string; total: number }) => ({
      category: c._id,
      value: c.total,
    }));
  }

  async getModerationActions(startDate: Date, repo?: string): Promise<any> {
    const filter = this.buildFilter(startDate, repo);
    const accepted = await this.commentsModel.countDocuments({
      ...filter,
      solutioned: true,
      suggestion_id: { $ne: null },
    });
    const refused = await this.suggestionsModel.countDocuments({
      ...filter,
      is_rejected: true,
    });
    const totalActions = accepted + refused;
    return {
      total: totalActions,
      data: [
        { name: 'Accept', value: accepted },
        { name: 'Reject', value: refused },
      ],
    };
  }

  async getDashboardData(period: string = '24h', repo?: string) {
    const startDate = this.calculateStartDate(period);
    const filter = this.buildFilter(startDate, repo);

    const totalComments = await this.commentsModel.countDocuments(filter);
    const flaggedComments = await this.commentsModel.countDocuments({
      ...filter,
      toxicity_score: { $gte: 0.8 },
    });
    const acceptedSuggestionsCount = await this.commentsModel.countDocuments({
      ...filter,
      solutioned: true,
      suggestion_id: { $ne: null },
    });
    const refusedSuggestions = await this.suggestionsModel.countDocuments({
      ...filter,
      is_rejected: true,
    });
    const resolvedComments = await this.commentsModel.countDocuments({
      ...filter,
      is_resolved: true,
    });
    const { medianCommentScore, averageCommentScore } =
      await this.getCommentScores(startDate, repo);
    const recentFlagged = await this.getRecentFlagged(startDate, repo);
    const radarFlags = await this.getRadarFlags(startDate, repo);
    const moderationActions = await this.getModerationActions(startDate, repo);

    return {
      averageCommentScore,
      medianCommentScore,
      totalComments,
      resolvedComments,
      flaggedComments,
      acceptedSuggestionsCount,
      refusedSuggestions,
      recentFlagged,
      radarFlags,
      moderationActions,
    };
  }

  async getIncivilityByType(
    period: string,
    type: string,
    repo?: string,
  ): Promise<any[]> {
    const startDate = this.calculateStartDate(period);
    const filter = this.buildFilter(startDate, repo);
    filter['parentType'] = type;

    const incivilityAgg = await this.commentsModel.aggregate([
      { $match: filter },
      {
        $addFields: {
          parentType: { $ifNull: ['$parentType', ''] },
          week: { $dateToString: { format: '%G-%V', date: '$created_at' } },
        },
      },
      {
        $group: {
          _id: '$week',
          incivilityCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 4 },
    ]);

    return incivilityAgg.map(
      (item: { _id: string; incivilityCount: number }) => ({
        week: item._id,
        count: item.incivilityCount,
      }),
    );
  }
}
