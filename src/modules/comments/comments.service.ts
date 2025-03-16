import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
  ) {}

  // TODO: Precisa refatorar pensando em como o usuário tratará de editar na interface
  // e.g: Usuário edita uma sugestão e clica em enviar, como mapear que ela foi editada?
  // Se o usuário não edita, quais informações são enviadas?

  async editComment(
    token: string,
    githubAuthorId: string,
    commentId: string,
    suggestionIndex: number,
  ): Promise<GithubResponse> {
    const comment = await this.commentModel.findOne({
      gh_comment_id: commentId,
      author_id: githubAuthorId,
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const suggestionDoc = await this.suggestionModel.findOne({
      gh_comment_id: commentId,
    });
    if (!suggestionDoc) {
      throw new NotFoundException('Suggestion not found');
    }

    if (
      suggestionIndex < 0 ||
      suggestionIndex >= suggestionDoc.suggestions.length
    ) {
      throw new BadRequestException('Invalid suggestion index');
    }
    const suggestionToApply =
      suggestionDoc.suggestions[suggestionIndex].content;

    const url = `https://api.github.com/repos/${comment.repository_fullname}/issues/comments/${encodeURIComponent(commentId)}`;

    try {
      const response = await this.httpService.axiosRef.patch(
        url,
        { body: suggestionToApply },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
          },
        },
      );
      const responseData = response.data as GithubResponse;

      console.log(responseData);

      suggestionDoc.suggestion_selected_index = suggestionIndex;
      await suggestionDoc.save();

      comment.solutioned = true;
      comment.solution = suggestionToApply;
      await comment.save();

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
      gh_comment_id: id,
    });

    return comment;
  }
}
