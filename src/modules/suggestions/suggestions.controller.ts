import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Suggestions')
@Controller('suggestions')
export class SuggestionsController {}
