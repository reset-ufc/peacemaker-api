import { Controller, Get, HttpStatus, Param, Patch, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SuggestionsService } from './suggestions.service';

@ApiTags('Suggestions')
@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionService: SuggestionsService) {}

  @Get()
  getAll() {
    const suggestions = this.suggestionService.getAll();

    return suggestions;
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    const suggestion = this.suggestionService.getById(id);

    return suggestion;
  }

  @Patch(':comment_id/reject/:suggestionIndex')
  async rejectSuggestion(
    @Param('comment_id') commentId: string,
    @Param('suggestionIndex') suggestionIndex: number,
    @Res() response: Response,
  ) {
    try {
      const result = await this.suggestionService.rejectSuggestion(
        commentId,
        suggestionIndex,
      );
      return response.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  }
}
