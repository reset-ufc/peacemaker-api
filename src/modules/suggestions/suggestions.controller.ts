import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
}
