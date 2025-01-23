import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { Comment } from './entities/comment.entity';
import { GithubResponse } from './entities/github-response.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
    private readonly httpService: HttpService,
  ) {}

  async editComment(token: string, username: string, commentId: string) {
    const comment = await this.commentModel.findOne({
      comment_id: commentId,
      login: username,
    });

    if (comment != null) {
      const [owner, repo] = comment.repo_full_name.split('/');

      const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues/comments/${encodeURIComponent(commentId)}`;

      try {
        const response = await this.httpService.axiosRef.patch(
          url,
          { body: comment.suggestions.corrected_comment },
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
          console.error('Error fetching access token:', error.response?.data);
          throw new Error(`Failed to fetch access token: ${error.message}`);
        }
        throw error;
      }
    }

    return { msg: 'no comment found' };
  }

  findAll() {
    return this.commentModel.find();
  }

  findAllByRepository(repositoryId: string) {
    return this.commentModel.find({ repository_id: repositoryId });
  }

  findOne(id: string) {
    return this.commentModel.findOne({
      comment_id: id,
    });
  }
}
