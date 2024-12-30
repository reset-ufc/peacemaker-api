import { GITHUB_USER_REPOSITORIES_URL } from '@/config/github.containsts';
import { UserService } from '@/modules/user/user.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { GithubRepositoryResponse } from './entities/repository-response.entity';
import { Repository } from './entities/repository.entity';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectModel(Repository.name)
    private readonly repositoryModel: Model<Repository>,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {}

  create(createRepositoryDto: CreateRepositoryDto) {
    const repository = new this.repositoryModel(createRepositoryDto);
    return repository.save();
  }

  findAll() {
    return this.repositoryModel.find();
  }

  findOne(repositoryId: number) {
    return this.repositoryModel.findOne({ repository_id: repositoryId });
  }

  async findRemoteRepositories(githubId: number) {
    const user = await this.userService.findOneByGithubId(githubId);

    const response = await this.httpService.axiosRef
      .get(GITHUB_USER_REPOSITORIES_URL(), {
        headers: {
          Authorization: `Bearer ${user?.github_token}`,
        },
      })
      .then(
        (response) =>
          response.data as unknown as Array<GithubRepositoryResponse>,
      );

    const repositoriesFiltered = response.filter(
      (repository) => repository.permissions.admin,
    );

    const repositoriesInserted: Repository[] = repositoriesFiltered.map(
      (repository: GithubRepositoryResponse) => ({
        repository_id: repository.id,
        repository_name: repository.name,
        description: repository.description,
        github_html_url: repository.html_url,
        is_private: repository.private,
        is_fork: repository.fork,
        is_archived: repository.archived,
        is_disabled: repository.disabled,
        is_template: repository.is_template,
        visibility: repository.visibility,
        user_permissions: repository.permissions,
        user_id: repository.owner.id,
      }),
    );

    await this.repositoryModel.insertMany(repositoriesInserted);

    return repositoriesInserted;
  }
}
