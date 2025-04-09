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

  /**
   * @param period - '24h', '7d' ou '30d'
   */
  calculateStartDate(period: string): Date {
    let periodMs = 24 * 60 * 60 * 1000; // 24h padrão
    if (period === '7d') {
      periodMs = 7 * 24 * 60 * 60 * 1000;
    } else if (period === '30d') {
      periodMs = 30 * 24 * 60 * 60 * 1000;
    } else if (period === '1y') {
      periodMs = 365 * 24 * 60 * 60 * 1000;
    }
    return new Date(Date.now() - periodMs);
  }

  async getModerationActivity(startDate: Date) {
    const moderationActivityAgg = await this.commentsModel.aggregate([
      { $match: { created_at: { $gte: startDate } } },
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

  private async getRecentFlagged(startDate: Date) {
    const recentFlaggedDocs = await this.commentsModel
      .find({ created_at: { $gte: startDate }, toxicity_score: { $gte: 0.8 } })
      .sort({ created_at: -1 })
      .limit(5)
      .lean();
    return recentFlaggedDocs.map(doc => {
      let severity = 'Medium';
      if (doc.toxicity_score >= 0.9) severity = 'High';
      return {
        author: doc.gh_comment_sender_login,
        severity,
        action: severity === 'High' ? 'Review' : 'Mute',
      };
    });
  }

  private async getRadarFlags(startDate: Date) {
    const classificationDataAgg = await this.commentsModel.aggregate([
      { $match: { created_at: { $gte: startDate } } },
      { $group: { _id: '$classification', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
    return classificationDataAgg.map((c: { _id: string; total: number }) => ({
      category: c._id,
      value: c.total,
    }));
  }

  private async getModerationActions(
    startDate: Date,
    accepted: number,
    refused: number,
  ) {
    const totalActions = accepted + refused;
    return {
      total: totalActions,
      data: [
        { name: 'Accept', value: accepted },
        { name: 'Reject', value: refused },
      ],
    };
  }

  private async getCommentScores(startDate: Date) {
    const medianScoreAgg: { median: number }[] =
      await this.commentsModel.aggregate([
        { $match: { created_at: { $gte: startDate } } },
        { $group: { _id: null, median: { $avg: '$toxicity_score' } } },
        { $project: { _id: 0, median: { $round: ['$median', 2] } } },
      ]);
    const averageScoreAgg: { average: number }[] =
      await this.commentsModel.aggregate([
        { $match: { created_at: { $gte: startDate } } },
        { $group: { _id: null, average: { $avg: '$toxicity_score' } } },
        { $project: { _id: 0, average: { $round: ['$average', 2] } } },
      ]);
    return {
      medianCommentScore: medianScoreAgg.length ? medianScoreAgg[0].median : 0,
      averageCommentScore: averageScoreAgg.length
        ? averageScoreAgg[0].average
        : 0,
    };
  }

  async getDashboardData(period: string = '24h') {
    const startDate = this.calculateStartDate(period);

    const totalComments = await this.commentsModel.countDocuments({
      created_at: { $gte: startDate },
    });
    const flaggedComments = await this.commentsModel.countDocuments({
      created_at: { $gte: startDate },
      toxicity_score: { $gte: 0.8 },
    });
    const acceptedSuggestions = await this.suggestionsModel.countDocuments({
      created_at: { $gte: startDate },
      is_edited: true,
      is_rejected: false,
    });
    const refusedSuggestions = await this.suggestionsModel.countDocuments({
      created_at: { $gte: startDate },
      is_rejected: true,
    });
    const resolvedComments = await this.commentsModel.countDocuments({
      created_at: { $gte: startDate },
      is_resolved: true,
    });

    const { medianCommentScore, averageCommentScore } =
      await this.getCommentScores(startDate);

    const recentFlagged = await this.getRecentFlagged(startDate);
    const radarFlags = await this.getRadarFlags(startDate);
    const moderationActions = await this.getModerationActions(
      startDate,
      acceptedSuggestions,
      refusedSuggestions,
    );

    return {
      averageCommentScore,
      medianCommentScore,
      totalComments,
      resolvedComments,
      flaggedComments,
      acceptedSuggestions,
      refusedSuggestions,
      recentFlagged,
      radarFlags,
      moderationActions,
    };
  }
}
