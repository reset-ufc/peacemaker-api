import { UserService } from '@/user/user.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGhRepositoryDto } from './dto/create-gh-repository.dto';
import { GhRepository } from './entities/gh-repository.entity';
import { GithubRepositoryResponse } from './entities/github-repository-response';

@Injectable()
export class GhRepositoriesService {
  constructor(
    @InjectModel(GhRepository.name)
    private readonly ghRepositoryModel: Model<GhRepository>,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}

  async create(createGhRepositoryDto: CreateGhRepositoryDto) {
    return this.ghRepositoryModel.create(createGhRepositoryDto);
  }

  async getRepositories(github_id: string) {
    const localRepositories = await this.findLocalRepositories(github_id);

    if (localRepositories.repositories.length > 0) {
      return {
        repositories: localRepositories.repositories,
        from: localRepositories.from,
      };
    }

    const remoteRepositories = await this.findRemoteRepositories(github_id);

    return {
      repositories: remoteRepositories.repositories,
      from: remoteRepositories.from,
    };
  }

  async findLocalRepositories(github_id: string) {
    const repositories = await this.ghRepositoryModel
      .find({
        github_id,
      })
      .exec();

    return { repositories, from: 'local mongodb' };
  }

  async findRemoteRepositories(github_id: string) {
    const user = await this.userService.getUser(github_id);
    const githubToken = user?.github_token;

    const response = await this.httpService.axiosRef.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    const repositoriesFiltered = Array.isArray(response.data)
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        response.data.filter((repository) => repository.permissions.admin)
      : [];

    const repositoriesInserted = repositoriesFiltered.map(
      (repository: GithubRepositoryResponse) => ({
        repository_id: repository.id,
        repository_name: repository.name,
        repository_full_name: repository.full_name,
        permissions: repository.permissions,
        user_id: github_id,
      }),
    );

    await this.ghRepositoryModel.insertMany(repositoriesInserted);

    return {
      repositories: repositoriesInserted,
      from: 'remote github',
    };
  }
}
