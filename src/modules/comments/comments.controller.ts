import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { SuggestionsService } from '../suggestions/suggestions.service';
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
}
