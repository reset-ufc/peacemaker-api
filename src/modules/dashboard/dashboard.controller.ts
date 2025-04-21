// src/dashboard/dashboard.controller.ts
import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  async getDashboardMetrics(
    @Query('period') period: string, // '24h', '7d', '30d' ou '1y'
    @Query('repo') repo: string, // opcional, por exemplo, o id do repositório
    @Res() response: Response,
  ) {
    try {
      const selectedPeriod = period || '24h';
      const data = await this.dashboardService.getDashboardData(
        selectedPeriod,
        repo,
      );
      return response.status(HttpStatus.OK).json(data);
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('overview')
  async getOverviewMetrics(
    @Query('period') period: string,
    @Query('repo') repo: string,
    @Res() response: Response,
  ) {
    try {
      const selectedPeriod = period || '24h';
      const data = await this.dashboardService.getOverviewMetrics(
        selectedPeriod,
        repo,
      );
      return response.status(HttpStatus.OK).json(data);
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('moderation-activity')
  async getModerationActivity(
    @Query('period') period: string,
    @Query('repo') repo: string,
    @Res() response: Response,
  ) {
    try {
      const selectedPeriod = period || '24h';
      const startDate =
        this.dashboardService.calculateStartDate(selectedPeriod);
      const data = await this.dashboardService.getModerationActivity(
        startDate,
        repo,
      );
      return response.status(HttpStatus.OK).json(data);
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('recent-flagged')
  async getRecentFlagged(
    @Query('period') period: string,
    @Query('repo') repo: string,
    @Res() response: Response,
  ) {
    try {
      const selectedPeriod = period || '24h';
      const startDate =
        this.dashboardService.calculateStartDate(selectedPeriod);
      const data = await this.dashboardService.getRecentFlagged(
        startDate,
        repo,
      );
      return response.status(HttpStatus.OK).json(data);
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('radar-flags')
  async getRadarFlags(
    @Query('period') period: string,
    @Query('repo') repo: string,
    @Res() response: Response,
  ) {
    try {
      const selectedPeriod = period || '24h';
      const startDate =
        this.dashboardService.calculateStartDate(selectedPeriod);
      const data = await this.dashboardService.getRadarFlags(startDate, repo);
      return response.status(HttpStatus.OK).json(data);
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('moderation-actions')
  async getModerationActions(
    @Query('period') period: string,
    @Query('repo') repo: string,
    @Res() response: Response,
  ) {
    try {
      const selectedPeriod = period || '24h';
      const startDate =
        this.dashboardService.calculateStartDate(selectedPeriod);
      const data = await this.dashboardService.getModerationActions(
        startDate,
        repo,
      );
      return response.status(HttpStatus.OK).json(data);
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('incivilities-by-type')
  async getIncivilityByType(
    @Query('period') period: string,
    @Query('repo') repo: string,
    @Query('type') type: string,
    @Res() response: Response,
  ) {
    try {
      const selectedPeriod = period || '24h';
      const data = await this.dashboardService.getIncivilityByType(
        selectedPeriod,
        type,
        repo,
      );
      return response.status(HttpStatus.OK).json(data);
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
