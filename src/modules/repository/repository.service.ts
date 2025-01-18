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

  findAll(githubId: number) {
    return this.repositoryModel.find({ user_id: githubId }).exec();
  }

  findOne(username: string, repository: string, githubId: number) {
    const repositoryFullName = username + '/' + repository;
    return this.repositoryModel
      .findOne({
        repository_full_name: repositoryFullName,
        user_id: githubId,
      })
      .exec();
  }

  async findRemoteRepositories(githubId: number) {
    const user = await this.userService.findOneByGithubId(githubId);

    const response = await this.httpService.axiosRef
      .get('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${user?.github_token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      .then(
        response => response.data as unknown as Array<GithubRepositoryResponse>,
      );

    // TODO: some privates repositories are not saved on the database
    const repositoriesFiltered = response.filter(
      repository => repository.permissions.admin,
    );

    const repositoriesInserted: Repository[] = repositoriesFiltered.map(
      (repository: GithubRepositoryResponse) => ({
        repository_id: String(repository.id),
        repository_name: repository.name,
        repository_full_name: repository.full_name,
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

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const existingRepositories = await this.findAll(user?.github_id!);

    // TODO: validate user repositories, insert new ones;
    // if the user already has repositories, we don't need to insert them again
    if (existingRepositories.length > 0) {
      return existingRepositories;
    }

    // validate if the user has all remote repositories on local database
    // if not, we need to insert them
    repositoriesInserted.forEach(repository => {
      if (
        !existingRepositories.find(
          r => r.repository_id === repository.repository_id,
        )
      ) {
        this.create(repository);
      }
    });

    return repositoriesInserted;
  }
}
