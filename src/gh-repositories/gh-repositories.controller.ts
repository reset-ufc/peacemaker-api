import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { User } from '@/user/entities/user.entity';
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
  async getRepositories(@Res() response: Response, @CurrentUser() user: User) {
    const repositories = await this.ghRepositoriesService.getRepositories(
      String(user.github_id),
    );

    return response.status(200).json({
      repositories,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all repositories from remote github' })
  @ApiResponse({
    status: 200,
    description: 'The repositories have been successfully retrieved.',
  })
  @Get('remote')
  async getRemoteRepositories(
    @Res() response: Response,
    @CurrentUser() user: User,
  ) {
    const repositories =
      await this.ghRepositoriesService.findRemoteRepositories(
        String(user.github_id),
      );

    return response.status(200).json({
      repositories,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all repositories from local mongodb' })
  @ApiResponse({
    status: 200,
    description: 'The repositories have been successfully retrieved.',
  })
  @Get('local')
  async getLocalRepositories(
    @Res() response: Response,
    @CurrentUser() user: User,
  ) {
    const repositories = await this.ghRepositoriesService.findLocalRepositories(
      String(user.github_id),
    );

    return response.status(200).json({
      repositories,
    });
  }
}
