import { UserService } from '@/modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
    private readonly userService: UserService,
  ) {}

  async findToxicComments(repositoryId: string): Promise<Comment[]> {
    return this.commentModel
      .find({
        repository_id: repositoryId,
        toxicity_score: { $gt: 0.5 },
      })
      .exec();
  }

  async editComment(
    commentId: string,
    newContent: string,
    owner: string,
    repo: string,
  ): Promise<any> {
    const githubToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN; // Token de acesso pessoal do GitHub

    if (!githubToken) {
      throw new Error(
        'GitHub token is missing. Set it in the environment variables.',
      );
    }

    try {
      const response = await axios.patch(
        // Endpoint para atualizar um comentário no GitHub, Lembrar de remover o owner e repo estáticos
        `https://api.github.com/repos/${owner}/${repo}/issues/comments/${commentId}`,
        { body: newContent },
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: 'application/vnd.github+json',
          },
        },
      );

      return {
        message: 'Comment updated successfully',
        data: response.data,
      };
    } catch (error) {
      console.error(
        'Error updating comment:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to update comment on GitHub.');
    }
  }

  create(repositoryId: string, createCommentDto: CreateCommentDto) {
    const comment = new this.commentModel({
      ...createCommentDto,
      repository_id: repositoryId,
    });
    return comment.save();
  }

  findAll(repositoryId: string) {
    return this.commentModel.find({ repository_id: repositoryId });
  }

  findOne(id: string) {
    return this.commentModel.findOne({
      comment_or_pull_request_id: id,
    });
  }

  update(id: string, updateCommentDto: UpdateCommentDto) {
    return this.commentModel.findOneAndUpdate(
      { comment_or_pull_request_id: id },
      updateCommentDto,
    );
  }
}
