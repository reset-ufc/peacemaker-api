import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { GhRepositoriesService } from './gh-repositories.service';

@ApiTags('Github Repositories')
@UseGuards(JwtAuthGuard)
@Controller('gh-repositories')
export class GhRepositoriesController {
  constructor(private readonly ghRepositoriesService: GhRepositoriesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all repositories' })
  @ApiResponse({
    status: 200,
    description: 'The repositories have been successfully retrieved.',
  })
  @Get()
  async getRepositories(@Res() response: Response) {
    const repositories = await this.ghRepositoriesService.getRepositories();

    return response.status(200).json({
      repositories,
    });
  }
}
