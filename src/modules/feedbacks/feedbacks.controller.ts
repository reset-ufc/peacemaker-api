import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Feedbacks')
@Controller('feedbacks')
export class FeedbacksController {}
