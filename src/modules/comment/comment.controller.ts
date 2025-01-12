import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Comments')
@Controller('v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':repository_id')
  getComments(@Param('repository_id') repositoryId: string) {
    return this.commentService.findAll(repositoryId);
  }

  @Get(':repository_id/toxic-comments')
  getToxicComments(@Param('repository_id') repositoryId: string) {
    return this.commentService.findToxicComments(repositoryId);
  }

  @Get(':id')
  getComment(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Post(':repository_id')
  createComment(
    @Param('repository_id') repositoryId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(repositoryId, createCommentDto);
  }

  @Patch(':repository_id/:id')
  updateComment(@Param('id') id: string, @Body() body: { content: string }) {
    return { id, content: body.content };
  }

  @Patch(':id')
  async editComment(
    @Param('id') commentId: string,
    @Body() body: { content: string; owner: string; repo: string },
  ) {
    if (!body.content) {
      throw new Error('Content cannot be empty.');
    }

    return await this.commentService.editComment(
      commentId,
      body.content,
      body.owner,
      body.repo,
    );
  }

  @Delete(':repository_id/:id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteComment(@Param('id') id: string) {
    return { message: 'Comment deleted successfully' };
  }
}
