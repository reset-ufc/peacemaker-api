import { User } from '@/modules/user/entities/user.entity';
import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { RepositoryService } from './repository.service';

@ApiCookieAuth()
@ApiTags('Repository')
@Controller('v1/repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get()
  async getAllRepositories() {
    const repositories = await this.repositoryService.findAll();
    return { repositories };
  }

  @Get('/remote')
  getRepositoriesFromRemote(@Req() request: Request) {
    const user = request?.user as User;

    return this.repositoryService.findRemoteRepositories(user.github_id);
  }

  @Get(':id')
  getRepository(@Param('id') id: number) {
    return this.repositoryService.findOne(id);
  }
}
