// src/dashboard/dashboard.controller.ts
import { Controller, Get, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtPayload } from '../auth/jwt/entities/jwt.entity';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  async getDashboardMetrics(
    @Query('period') period: string, // '24h', '7d', '30d' ou '1y'
    @Query('repo') repo: string, // opcional, por exemplo, o id do repositório
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const user = request?.user as JwtPayload['user'];
    try {
      const selectedPeriod = period || '24h';
      const data = await this.dashboardService.getDashboardData(
        selectedPeriod,
        repo,
        user.github_id,
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
    @Req() request: Request,
  ) {
    const user = request?.user as JwtPayload['user'];
    try {
      const selectedPeriod = period || '24h';
      const data = await this.dashboardService.getOverviewMetrics(
        selectedPeriod,
        repo,
        user.github_id,
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
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const user = request?.user as JwtPayload['user'];
    try {
      const selectedPeriod = period || '24h';
      const startDate =
        this.dashboardService.calculateStartDate(selectedPeriod);
      const data = await this.dashboardService.getModerationActivity(
        startDate,
        repo,
        user.github_id,
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
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const user = request?.user as JwtPayload['user'];
    try {
      const selectedPeriod = period || '24h';
      const startDate =
        this.dashboardService.calculateStartDate(selectedPeriod);
      const data = await this.dashboardService.getRecentFlagged(
        startDate,
        repo,
        user.github_id,
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
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const user = request?.user as JwtPayload['user'];
    try {
      const selectedPeriod = period || '24h';
      const startDate =
        this.dashboardService.calculateStartDate(selectedPeriod);
      const data = await this.dashboardService.getRadarFlags(
        startDate,
        repo,
        user.github_id,
      );
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
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const user = request?.user as JwtPayload['user'];
    try {
      const selectedPeriod = period || '24h';
      const startDate =
        this.dashboardService.calculateStartDate(selectedPeriod);
      const data = await this.dashboardService.getModerationActions(
        startDate,
        repo,
        user.github_id,
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
    @Query('repo') repo: string,
    @Query('type') type: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const user = request?.user as JwtPayload['user'];
    try {
      const data = await this.dashboardService.getIncivilityByType(
        type,
        repo,
        user.github_id,
      );
      return response.status(HttpStatus.OK).json(data);
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
