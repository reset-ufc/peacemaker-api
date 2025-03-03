import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { Suggestion } from '../suggestions/entities/suggestion.entity';
import { Comment } from './entities/comment.entity';
import { GithubResponse } from './entities/github-reponse.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Suggestion.name)
    private readonly suggestionModel: Model<Suggestion>,
    private readonly httpService: HttpService,
  ) {}

  async editComment(token: string, username: string, commentId: string) {
    const comment = await this.commentModel.findOne({
      comment_id: commentId,
      login: username,
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    const suggestion = await this.suggestionModel.findOne({
      comment_id: commentId,
    });

    if (!suggestion) {
      throw new Error('Suggestion not found');
    }

    try {
      const response = await this.httpService.axiosRef.patch(
        `https://api.github.com/repos/owner/repo/issues/comments/${encodeURIComponent(commentId)}`,
        { body: suggestion.content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
          },
        },
      );

      const responseData = (await response.data) as unknown as GithubResponse;

      return responseData;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to fetch access token: ${error.message}`);
      }
      throw error;
    }
  }

  // async rejectSuggestion(
  //   username: string,
  //   commentId: string,
  //   suggestionIndex: number,
  // ) {
  //   const comment = await this.commentModel
  //     .findOne({
  //       comment_id: commentId,
  //       login: username,
  //     })
  //     .exec();

  //   if (!comment) {
  //     return { status: HttpStatus.NOT_FOUND, message: 'Comment not found' };
  //   }

  //   if (
  //     !comment.suggestions ||
  //     suggestionIndex < 0 ||
  //     suggestionIndex >= comment.suggestions.length
  //   ) {
  //     return {
  //       status: HttpStatus.BAD_REQUEST,
  //       message: 'Invalid suggestion index',
  //     };
  //   }

  //   comment.suggestions.splice(suggestionIndex, 1);
  //   comment.markModified('suggestions');
  //   await comment.save();

  //   return {
  //     status: HttpStatus.OK,
  //     message: 'Suggestion rejected successfully',
  //   };
  // }

  async findAll() {
    const allComments = await this.commentModel.find().exec();

    return allComments;
  }

  async findAllByRepository(repositoryId: string) {
    const commentsByRepository = await this.commentModel.find({
      repository_id: repositoryId,
    });

    return commentsByRepository;
  }

  async findOne(id: string) {
    const comment = await this.commentModel.findOne({
      comment_id: id,
    });

    return comment;
  }
}
