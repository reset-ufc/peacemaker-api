import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(':userId/:repositoryId/average-score')
  async getAverageScore(
    @Param('userId') userId: string,
    @Param('repositoryId') repositoryId: string,
  ): Promise<number> {
    return this.analyticsService.calculateAverageScore(userId, repositoryId);
  }

  @Get(':userId/:repositoryId/total-comments')
  async getTotalComments(
    @Param('userId') userId: string,
    @Param('repositoryId') repositoryId: string,
  ): Promise<number> {
    return this.analyticsService.getTotalComments(userId, repositoryId);
  }

  @Get(':userId/:repositoryId/removed-comments')
  async getRemovedComments(
    @Param('userId') userId: string,
    @Param('repositoryId') repositoryId: string,
  ): Promise<number> {
    return this.analyticsService.countRemovedComments(userId, repositoryId);
  }

  @Get(':userId/:repositoryId/absolute-comments')
  async getAbsoluteComments(
    @Param('userId') userId: string,
    @Param('repositoryId') repositoryId: string,
  ): Promise<number> {
    return this.analyticsService.countAbsoluteComments(userId, repositoryId);
  }

  @Get(':userId/:repositoryId/incivility-types')
  async getIncivilityTypes(
    @Param('userId') userId: string,
    @Param('repositoryId') repositoryId: string,
  ): Promise<Record<string, number>> {
    return this.analyticsService.getIncivilityTypes(userId, repositoryId);
  }
}
