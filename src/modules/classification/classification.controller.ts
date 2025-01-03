import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Classification')
@Controller('v1/classification')
export class ClassificationController {
  @Get(':repository_id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getClassifications(@Param('repository_id') repositoryId: string) {
    return [{ id: 'classification1', type: 'irony', confidence: 0.92 }];
  }

  @Get(':repository_id/:comment_id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getClassification(@Param('comment_id') commentId: string) {
    return { id: 'classification1', type: 'irony', confidence: 0.92 };
  }

  @Post(':repository_id/:comment_id')
  createClassification(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('comment_id') commentId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() body: { content: string },
  ) {
    return { id: 'new_classification', type: 'mocking', confidence: 0.88 };
  }
}
