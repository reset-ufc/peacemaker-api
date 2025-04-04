import { Body, Controller, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { SuggestionsService } from './suggestions.service';

@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

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
}
