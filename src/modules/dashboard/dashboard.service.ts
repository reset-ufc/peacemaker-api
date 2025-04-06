// src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comments, CommentsDocument } from '../comments/entities/comment.entity';
import { Feedbacks, FeedbacksDocument } from '../suggestions/entities/feedback.entity';
import { Suggestions, SuggestionsDocument } from '../suggestions/entities/suggestion.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Comments.name) private readonly commentsModel: Model<CommentsDocument>,
    @InjectModel(Suggestions.name) private readonly suggestionsModel: Model<SuggestionsDocument>,
    @InjectModel(Feedbacks.name) private readonly feedbacksModel: Model<FeedbacksDocument>,
  ) {}

  async getDashboardData(period: string = '24h') {
    let periodMs = 24 * 60 * 60 * 1000;
    if (period === '7d') periodMs = 7 * 24 * 60 * 60 * 1000;
    else if (period === '30d') periodMs = 30 * 24 * 60 * 60 * 1000;
    const startDate = new Date(Date.now() - periodMs);

    // 1) Contagens filtradas pelo período
    const totalComments = await this.commentsModel.countDocuments({ created_at: { $gte: startDate } });
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

    // 2) Moderation Activity: agrupar por mês (abreviado) dos comentários dentro do período
    const moderationActivityAgg = await this.commentsModel.aggregate([
      { $match: { created_at: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%b", date: "$created_at" } },
          comments: { $sum: 1 },
          flags: { $sum: { $cond: [ { $gte: ["$toxicity_score", 0.8] }, 1, 0 ] } },
        },
      },
      { $sort: { '_id': 1 } },
    ]);
    const moderationActivity = moderationActivityAgg.map(item => ({
      month: item._id,
      comments: item.comments,
      flags: item.flags,
    }));

    // 3) Recent Flagged: comentários com toxicity_score >= 0.8 dentro do período
    const recentFlaggedDocs = await this.commentsModel
      .find({ created_at: { $gte: startDate }, toxicity_score: { $gte: 0.8 } })
      .sort({ created_at: -1 })
      .limit(5)
      .lean();
    const recentFlagged = recentFlaggedDocs.map(doc => {
      let severity = "Medium";
      if (doc.toxicity_score >= 0.9) severity = "High";
      return {
        author: doc.gh_comment_sender_login,
        severity,
        action: severity === "High" ? "Review" : "Mute",
      };
    });

    // 4) Radar Flags: agrupar por classificação dentro do período
    const classificationDataAgg = await this.commentsModel.aggregate([
      { $match: { created_at: { $gte: startDate } } },
      { $group: { _id: "$classification", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
    const radarFlags = classificationDataAgg.map(c => ({
      category: c._id,
      value: c.total,
    }));

    // 5) Moderation Actions: simuladas (aceitas e rejeitadas dentro do período)
    const totalActions = acceptedSuggestions + refusedSuggestions;
    const moderationActions = {
      total: totalActions,
      data: [
        { name: "Accept", value: acceptedSuggestions },
        { name: "Reject", value: refusedSuggestions },
      ],
    };

    // 6) Para os cards, também podemos calcular median e average scores
    const medianScoreAgg = await this.commentsModel.aggregate([
      { $match: { created_at: { $gte: startDate } } },
      { $group: { _id: null, median: { $avg: "$toxicity_score" } } },
      { $project: { _id: 0, median: { $round: ["$median", 2] } } }
    ]);
    const medianScoreValue = medianScoreAgg.length ? medianScoreAgg[0].median : 0;
    const averageScoreAgg = await this.commentsModel.aggregate([
      { $match: { created_at: { $gte: startDate } } },
      { $group: { _id: null, average: { $avg: "$toxicity_score" } } },
      { $project: { _id: 0, average: { $round: ["$average", 2] } } }
    ]);
    const averageScoreValue = averageScoreAgg.length ? averageScoreAgg[0].average : 0;
    const resolvedComments = await this.commentsModel.countDocuments({
      created_at: { $gte: startDate },
      is_resolved: true,
    });

    return {
      averageCommentScore: averageScoreValue,
      medianCommentScore: medianScoreValue,
      totalComments,
      resolvedComments,
      moderationActivity,
      recentFlagged,
      radarFlags,
      moderationActions,
      flaggedComments,
      acceptedSuggestions,
      refusedSuggestions,
    };
  }
}