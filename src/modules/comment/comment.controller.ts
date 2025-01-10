// comments.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';

@ApiTags('Comments')
@Controller('v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':repository_id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getComments(@Param('repository_id') repositoryId: string) {
    return [{ id: 'comment1', content: 'Example comment', user: 'user123' }];
  }

  @Get(':id')
  getComment(@Param('id') id: string) {
    return { id, content: 'Example comment', user: 'user123' };
  }

  @Post(':repository_id')
  createComment(
    @Param('repository_id') repositoryId: string,
    @Body() body: { content: string; user: string },
  ) {
    return { id: 'new_comment', content: body.content, user: body.user };
  }

  @Patch(':repository_id/:id')
  updateComment(@Param('id') id: string, @Body() body: { content: string }) {
    return { id, content: body.content };
  }

  @Patch(':id')
  async editComment(
    @Param('id') commentId: string,
    @Body() body: { content: string, owner: string, repo: string },
  ) {
    if (!body.content) {
      throw new Error('Content cannot be empty.');
    }

    return await this.commentService.editComment(commentId, body.content, body.owner, body.repo);
  }

  @Delete(':repository_id/:id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteComment(@Param('id') id: string) {
    return { message: 'Comment deleted successfully' };
  }
}
