import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbacksService } from './feedbacks.service';

@ApiTags('Feedbacks')
@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  async createFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Res() response: Response,
  ) {
    try {
      const feedback =
        await this.feedbacksService.createFeedback(createFeedbackDto);
      return response.status(HttpStatus.CREATED).json({ feedback });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: errorMessage });
    }
  }
}
