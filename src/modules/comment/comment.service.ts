import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import axios from 'axios';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {}

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

  create(createCommentDto: CreateCommentDto) {
    const comment = new this.commentModel(createCommentDto);
    return comment.save();
  }

  findAll() {
    return this.commentModel.find();
  }

  findOne(id: string) {
    return this.commentModel.findOne({ comment_or_pull_request_id: id });
  }
}
