import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
      throw new NotFoundException('Suggestion not found');
    }

    try {
      const response = await this.httpService.axiosRef.patch(
        `https://api.github.com/repos/${comment.repo_full_name}/issues/comments/${encodeURIComponent(commentId)}`,
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
        throw new InternalServerErrorException(
          `Failed to update comment: ${error.message}`,
        );
      }
      throw error;
    }
  }

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
