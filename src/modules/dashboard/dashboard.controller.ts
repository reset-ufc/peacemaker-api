// src/dashboard/dashboard.controller.ts
import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  async getDashboardMetrics(
    @Query('period') period: string, // '24h', '7d' ou '30d'
    @Res() response: Response,
  ) {
    try {
      // Define um valor padrão se não for informado
      const selectedPeriod = period || '24h';
      const data = await this.dashboardService.getDashboardData(selectedPeriod);
      return response.status(HttpStatus.OK).json(data);
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('moderation-activity')
  async getModerationActivity(
    @Query('period') period: string, // '24h', '7d', '30d' ou '1y'
    @Res() response: Response,
  ) {
    try {
      const selectedPeriod = period || '24h';
      const startDate =
        this.dashboardService.calculateStartDate(selectedPeriod);
      const data = await this.dashboardService.getModerationActivity(startDate);
      return response.status(HttpStatus.OK).json(data);
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
