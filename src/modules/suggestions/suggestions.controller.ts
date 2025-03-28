import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
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
}
