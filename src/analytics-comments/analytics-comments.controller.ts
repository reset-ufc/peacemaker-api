import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AnalyticsCommentsService } from './analytics-comments.service';

@Controller('analytics-comments')
export class AnalyticsCommentsController {
  constructor(
    private readonly analyticsCommentsService: AnalyticsCommentsService,
  ) {}

  @Get('average-score/:repositoryId')
  async getAverageScore(@Param('repositoryId') repoId: string) {
    return this.analyticsCommentsService.getAverageScore(repoId);
  }

  @Get('median-score/:repositoryId')
  async getMedianScore(@Param('repositoryId') repoId: string) {
    return this.analyticsCommentsService.getMedianScore(repoId);
  }

  @Get('total-comments/:repositoryId')
  async getTotalComments(@Param('repositoryId') repoId: string) {
    return this.analyticsCommentsService.getTotalComments(repoId);
  }

  @Get('resolved-comments/:repositoryId')
  async getResolvedComments(@Param('repositoryId') repoId: string) {
    return this.analyticsCommentsService.getResolvedComments(repoId);
  }

  @Get('recent-users/:repositoryId')
  async getRecentUsers(@Param('repositoryId') repoId: string) {
    return this.analyticsCommentsService.getRecentUsers(repoId);
  }

  @Get('developers-count/:repositoryId')
  async getDevelopersCount(@Param('repositoryId') repoId: string) {
    return this.analyticsCommentsService.getDevelopersCount(repoId);
  }

  @Get('classification-count/:repositoryId')
  async getClassificationCount(@Param('repositoryId') repoId: string) {
    return this.analyticsCommentsService.getClassificationCount(repoId);
  }

  @Get('moderation-types/:repositoryId')
  async getModerationTypes(@Param('repositoryId') repoId: string) {
    return this.analyticsCommentsService.getModerationTypes(repoId);
  }

  @Get('likes-dislikes-insights/:repositoryId')
  async getLikesDislikesInsights(@Param('repositoryId') repoId: string) {
    return this.analyticsCommentsService.getLikesDislikesInsights(repoId);
  }
}
