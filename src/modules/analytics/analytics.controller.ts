import { UserService } from '@/modules/user/user.service';
import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('v1/analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly userService: UserService,
  ) {}

  @Get(':username/:repository_id/metrics')
  async getAllMetrics(
    @Res() response: Response,
    @Param('username') username: string,
    @Param('repository_id') repositoryId: string,
  ) {
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      return response.status(HttpStatus.UNAUTHORIZED).send();
    }

    const averageScore = await this.analyticsService.calculateAverageScore(
      user.github_id,
      repositoryId,
    );
    const totalComments = await this.analyticsService.getTotalComments(
      user.github_id,
      repositoryId,
    );
    const removedComments = await this.analyticsService.countRemovedComments(
      user.github_id,
      repositoryId,
    );
    const absoluteComments = await this.analyticsService.countAbsoluteComments(
      user.github_id,
      repositoryId,
    );
    const incivilityTypes = await this.analyticsService.getIncivilityTypes(
      user.github_id,
      repositoryId,
    );

    return response.status(HttpStatus.OK).json({
      average_score: averageScore,
      total_comments: totalComments,
      removed_comments: removedComments,
      absolute_comments: absoluteComments,
      incivility_types: incivilityTypes,
    });
  }
}
