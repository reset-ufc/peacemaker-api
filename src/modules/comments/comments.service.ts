import { Suggestions } from '@/modules/suggestions/entities/suggestion.entity';
import { User } from '@/modules/users/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { AcceptCommentSuggestionDto } from './dto/accept-suggestion.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { EditCommentEvent } from './edit-comment.event';
import { Comments } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private readonly commentsModel: Model<Comments>,
    @InjectModel(Suggestions.name)
    private readonly suggestionsModel: Model<Suggestions>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly httpService: HttpService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(userId: string) {
    // Base aggregation pipeline
    const pipeline: Array<PipelineStage> = [
      {
        $match: {
          gh_comment_sender_id: userId,
        },
      },
      {
        $lookup: {
          from: 'parents',
          localField: 'gh_comment_id',
          foreignField: 'comment_id',
          as: 'parent',
        },
      },
      {
        $unwind: {
          path: '$parent',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'suggestions',
          localField: 'gh_comment_id',
          foreignField: 'gh_comment_id',
          as: 'suggestions',
        },
      },
    ];

    // Execute aggregation pipeline
    const results = await this.commentsModel.aggregate(pipeline).exec();
    return results;
  }

  async findOne(id: string, userId: string) {
    // Base aggregation pipeline
    const pipeline: Array<PipelineStage> = [
      {
        $match: {
          gh_comment_id: id,
          gh_comment_sender_id: userId,
        },
      },
      {
        $lookup: {
          from: 'parents',
          localField: 'gh_comment_id',
          foreignField: 'comment_id',
          as: 'parent',
        },
      },
      {
        $unwind: {
          path: '$parent',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'suggestions',
          localField: 'gh_comment_id',
          foreignField: 'gh_comment_id',
          as: 'suggestions',
        },
      },
    ];

    // Execute aggregation pipeline
    const results = await this.commentsModel.aggregate(pipeline).exec();
    return results[0];
  }

  async verifySolutioned(commentId: string) {
    const comment = await this.commentsModel.findOne({
      gh_comment_id: commentId,
    });

    if (!comment) {
      return null;
    }

    return comment.solutioned;
  }

  async update(
    id: string,
    userGithubId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentsModel.findOneAndUpdate(
      {
        gh_comment_id: id,
        gh_comment_sender_id: userGithubId,
      },
      updateCommentDto,
      {
        new: true,
      },
    );

    return comment;
  }

  async acceptCommentSuggestion(
    commentId: string,
    userGithubId: string,
    suggestionId: string,
    acceptCommentSuggestionDto: AcceptCommentSuggestionDto,
  ) {
    const comment = await this.findOne(commentId, userGithubId);

    if (!comment) {
      return null;
    }

    const user = await this.userModel.findOne({ gh_user_id: userGithubId });

    if (!user) {
      return null;
    }

    const suggestionDoc = await this.suggestionsModel.findOne({
      gh_comment_id: commentId,
      _id: suggestionId,
    });

    if (!suggestionDoc) {
      return null;
    }

    this.eventEmitter.emit(
      'comment_suggestion.accepted',
      new EditCommentEvent(
        comment.gh_repository_owner,
        comment.gh_repository_name,
        comment.gh_comment_id,
        suggestionDoc.content,
        user.encrypted_token,
        acceptCommentSuggestionDto,
      ),
    );
  }

  @OnEvent('comment_suggestion.accepted')
  async commentEdit(event: EditCommentEvent) {
    try {
      const response = await this.httpService.axiosRef.patch(
        `https://api.github.com/repos/${event.repositoryOwner}/${event.repositoryName}/issues/comments/${encodeURIComponent(event.commentId)}`,
        { body: event.suggestionContent },
        {
          headers: {
            Authorization: `Bearer ${event.githubToken}`,
            Accept: 'application/vnd.github+json',
          },
        },
      );
      const responseData = response.data;
      console.log(responseData);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Failed to update comment: ${error.message}`,
      );
    }
  }
}
