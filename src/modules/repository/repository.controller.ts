import { User } from '@/modules/user/entities/user.entity';
import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { RepositoryService } from './repository.service';

@ApiTags('Repository')
@Controller('v1/repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

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
