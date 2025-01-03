import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('v1/analytics')
export class AnalyticsController {
  @Get()
  // TODO: implement
  getAllAnalytics() {
    return {
      totalRepositories: 120,
      averageCommentsToxicity: 0.45,
      medianCommentsToxicity: 0.2,
      totalComments: 1300,
      resolvedComments: 100,

      moderationActivity: [
        {
          sentiment: 'toxic',
          comments: 10,
        },
        {
          sentiment: 'neutral',
          comments: 20,
        },
        {
          sentiment: 'positive',
          comments: 30,
        },
      ],
    };
  }

  @Get(':repository_id')
  getAnalytics(@Param('repository_id') repositoryId: string) {
    return {
      id: 'analysis1',
    };
  }
}
