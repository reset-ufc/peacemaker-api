import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // TODO: implement
  @Get(':username')
  getAllAnalytics() {
    return this.analyticsService.getAllAnalytics();
  }

  // TODO: implement
  @Get(':username/:repository_id')
  getAnalytics(@Param('repository_id') repositoryId: string) {
    return this.analyticsService.getAnalytics(repositoryId);
  }
}
