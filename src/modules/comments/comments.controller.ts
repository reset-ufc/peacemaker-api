import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SuggestionsService } from '../suggestions/suggestions.service';
import { User } from '../users/entities/user.entity';
import { CommentsService } from './comments.service';

@ApiTags('Comments')
@ApiCookieAuth()
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentService: CommentsService,
    private readonly suggestionsService: SuggestionsService,
  ) {}

  @Get('')
  async getComments() {
    const comments = await this.commentService.findAll();

    return { comments };
  }

  @Get('/:comment_id/suggestions')
  async getCommentsSuggestions(@Param('comment_id') commentId: string) {
    const suggestions = await this.suggestionsService.findByComment(commentId);

    return { suggestions };
  }

  @Get(':id')
  async getComment(@Param('id') id: string) {
    const comment = await this.commentService.findOne(id);

    return { comment };
  }

  @Patch(':comment_id/edit')
  async editComment(
    @Req() req: Request,
    @Param('comment_id') commentId: string,
    @Body('suggestionIndex') suggestionIndex: number,
    @Res() response: Response,
  ) {
    const user = req.user as User;

    if (!user) {
      return response.status(HttpStatus.UNAUTHORIZED).send();
    }
    try {
      const updatedComment = await this.commentService.editComment(
        user.encrypted_token,
        user.github_id,
        commentId,
        suggestionIndex,
      );
      return response.status(HttpStatus.OK).json(updatedComment);
    } catch (error: any) {
      return (
        response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          .json({ message: error })
      );
    }
  }
}
