import { JwtPayload } from '@/modules/auth/jwt/entities/jwt.entity';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RepositoriesService } from './repositories.service';

@ApiTags('Repositories')
@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoryService: RepositoriesService) {}

  @Get()
  async getAllRepositories(@Req() request: Request, @Res() response: Response) {
    const user = request?.user as JwtPayload['user'];

    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const repositories = await this.repositoryService.findAll(user.github_id);

    return response.status(200).json({ repositories });
  }

  // @Get('remote')
  // async getRepositoriesFromRemote(
  //   @Req() request: Request,
  //   @Res() response: Response,
  // ) {
  //   const user = request?.user as JwtPayload['user'];

  //   if (!user) {
  //     return response.status(401).json({ message: 'Unauthorized' });
  //   }

  //   const repositories = await this.repositoryService.findRemoteRepositories(
  //     user.gh_user_id,
  //   );

  //   return response.status(200).json(repositories);
  // }

  @Get(':repositoryName')
  async getRepository(
    @Req() request: Request,
    @Param('repositoryName') repositoryName: string,
    @Res() response: Response,
  ) {
    const user = request?.user as JwtPayload['user'];

    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const repository = await this.repositoryService.findOne(
      repositoryName,
      user.github_id,
    );

    return response.status(200).json({ repository });
  }

  @Get(':repository_name/issues')
  async getParents(
    @Req() request: Request,
    @Param('repository_name') repositoryName: string,
    @Res() response: Response,
  ) {
    const user = request?.user as JwtPayload['user'];

    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const issues = await this.repositoryService.findAllByIssues(
      repositoryName,
      user.github_id,
    );

    return response.status(200).json({ issues });
  }

  @Get(':repository_name/comments')
  async getComments(
    @Req() request: Request,
    @Param('repository_name') repositoryName: string,
    @Res() response: Response,
  ) {
    const user = request?.user as JwtPayload['user'];

    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const comments = await this.repositoryService.findAllByRepository(
      repositoryName,
      user.github_id,
    );

    return response.status(200).json({ comments });
  }

  @Get(':repository_name/:parent_id/comments')
  async getIssueComments(
    @Req() request: Request,
    @Param('repository_name') repositoryName: string,
    @Param('parent_id') parentId: string,
    @Res() response: Response,
  ) {
    const user = request?.user as JwtPayload['user'];

    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const issues = await this.repositoryService.findIssueByRepository(
      repositoryName,
      parentId,
      user.github_id,
    );

    return response.status(200).json({ issues });
  }
}
