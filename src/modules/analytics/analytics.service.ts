import { Comment } from '@/modules/comment/entities/comment.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {}

  // TODO: implement this method
  getAllAnalytics() {
    return {
      totalRepositories: 120,
      averageCommentsToxicity: 0.45,
      medianCommentsToxicity: 0.2,
      totalComments: 1300,
      resolvedComments: 100,

      moderationActivity: [
        {
          sentiment: 'toxic',
          comments: 10,
        },
        {
          sentiment: 'neutral',
          comments: 20,
        },
        {
          sentiment: 'positive',
          comments: 30,
        },
      ],
    };
  }

  // TODO: implement this method
  getAnalytics(repositoryId: string) {
    return {
      id: repositoryId,
      totalRepositories: 120,
      averageCommentsToxicity: 0.45,
      medianCommentsToxicity: 0.2,
      totalComments: 1300,
      resolvedComments: 100,

      moderationActivity: [
        {
          sentiment: 'toxic',
          comments: 10,
        },
        {
          sentiment: 'neutral',
          comments: 20,
        },
        {
          sentiment: 'positive',
          comments: 30,
        },
      ],
    };
  }
}
