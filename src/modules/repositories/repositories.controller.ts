import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { User } from '../users/entities/user.entity';
import { RepositoriesService } from './repositories.service';

@ApiTags('Repositories')
@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoryService: RepositoriesService) {}

  @Get()
  async getAllRepositories(@Req() request: Request, @Res() response: Response) {
    const user = request?.user as User;

    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const repositories = await this.repositoryService.findAll(user.github_id);

    return response.status(200).json(repositories);
  }

  @Get('remote')
  async getRepositoriesFromRemote(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const user = request?.user as User;

    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const repositories = await this.repositoryService.findRemoteRepositories(
      user.github_id,
    );

    return response.status(200).json(repositories);
  }

  @Get(':repositoryName')
  async getRepository(
    @Req() request: Request,
    @Param('repositoryName') repositoryName: string,
    @Res() response: Response,
  ) {
    const user = request?.user as User;

    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const repository = await this.repositoryService.findOne(
      repositoryName,
      user.github_id,
    );

    // TODO: Por algum motivo o repository não está sendo retornado
    return response.status(200).json(repository);
  }
}
