import { Body, Controller, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtPayload } from '../auth/jwt/entities/jwt.entity';
import { CommentsService } from '../comments/comments.service';
import { AcceptCommentSuggestionDto } from '../comments/dto/accept-suggestion.dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { SuggestionsService } from './suggestions.service';

@Controller('suggestions')
export class SuggestionsController {
  constructor(
    private readonly suggestionsService: SuggestionsService,
    private readonly commentsService: CommentsService,
  ) {}

  @ApiBody({ type: CreateFeedbackDto })
  @Post('feedback')
  async feedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.suggestionsService.feedback(createFeedbackDto);
  }

  @ApiParam({ name: 'suggestion_id', type: String })
  @Patch(':suggestion_id/reject')
  async rejectCommentSuggestion(
    @Res() response: import('express').Response,
    @Param('suggestion_id') suggestionId: string,
  ) {
    const suggestion =
      await this.suggestionsService.rejectCommentSuggestion(suggestionId);

    if (!suggestion) {
      return response.status(404).json({
        message: 'Suggestion not found',
      });
    }
    return response.status(200).json({ message: suggestion.message });
  }

  @ApiParam({ name: 'suggestion_id', type: String })
  @Post(':suggestion_id/edit')
  async update(
    @Req() request: Request,
    @Res() response: Response,
    @Param('suggestion_id') suggestionId: string,
    @Body() updateSuggestionDto: { content: string },
  ) {
    const user = request?.user as JwtPayload['user'];
    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const updatedSuggestion = await this.suggestionsService.edit(
      suggestionId,
      updateSuggestionDto.content,
    );

    if (!updatedSuggestion) {
      return response.status(404).json({ message: 'Suggestion not found' });
    }

    const commentId = updatedSuggestion.gh_comment_id;

    const acceptDto: AcceptCommentSuggestionDto = {
      suggestion_content: updateSuggestionDto.content,
      is_edited: true,
    };

    await this.commentsService.acceptCommentSuggestion(
      commentId,
      user.github_id,
      suggestionId,
      acceptDto,
    );

    return response
      .status(200)
      .json({ message: 'Suggestion updated and accepted successfully' });
  }
}
