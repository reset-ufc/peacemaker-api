import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { RepositoriesService } from './repositories.service';

@ApiTags('Repositories')
@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoryService: RepositoriesService) {}

  @Get()
  async getAllRepositories(@Req() request: Request) {
    const user = request?.user as User;
    const repositories = await this.repositoryService.findAll(user.github_id);
    return { repositories };
  }

  @Get('remote')
  getRepositoriesFromRemote(@Req() request: Request) {
    const user = request?.user as User;

    return this.repositoryService.findRemoteRepositories(user.github_id);
  }

  @Get(':repository')
  getRepository(
    @Req() request: Request,
    @Param('username') username: string,
    @Param('repository') repository: string,
  ) {
    const user = request?.user as User;
    return this.repositoryService.findOne(username, repository, user.github_id);
  }
}
