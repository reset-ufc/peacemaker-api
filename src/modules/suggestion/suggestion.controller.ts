import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Suggestion')
@Controller('v1/suggestion')
export class SuggestionController {
  @Get(':comment_id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSuggestions(@Param('comment_id') commentId: string) {
    return [
      {
        id: 'suggestion1',
        content: 'Consider rephrasing this comment to be more constructive.',
      },
    ];
  }

  @Post(':comment_id')
  createSuggestion(
    @Param('comment_id') commentId: string,
    @Body() body: { content: string },
  ) {
    return { id: 'new_suggestion', content: body.content };
  }
}
