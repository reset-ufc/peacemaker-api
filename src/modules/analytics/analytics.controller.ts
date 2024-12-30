import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Analytics')
@Controller('v1/analytics')
export class AnalyticsController {
  @Get()
  getAllAnalytics() {
    return [
      { id: 'analysis1', repository: 'repo1', insights: { toxicity: 0.78 } },
    ];
  }

  @Get(':repository_id')
  getAnalytics(@Param('repository_id') repositoryId: string) {
    return {
      id: 'analysis1',
      repository: repositoryId,
      insights: { toxicity: 0.78 },
    };
  }
}
