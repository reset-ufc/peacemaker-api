import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { GithubRepositoryResponse } from './entities/repositories-reponse.entity';
import { Repository } from './entities/repository.entity';

@Injectable()
export class RepositoriesService {
  constructor(
    @InjectModel(Repository.name)
    private readonly repositoryModel: Model<Repository>,
    private readonly userService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  create(createRepositoryDto: CreateRepositoryDto) {
    const repository = new this.repositoryModel(createRepositoryDto);
    return repository.save();
  }

  findAll(githubId: string) {
    return this.repositoryModel.find({ user_id: githubId }).exec();
  }

  findOne(username: string, repository: string, githubId: string) {
    const repositoryFullName = username + '/' + repository;
    return this.repositoryModel
      .findOne({
        repository_full_name: repositoryFullName,
        user_id: githubId,
      })
      .exec();
  }

  async findRemoteRepositories(githubId: string) {
    const user = await this.userService.findOneByGithubId(githubId);

    if (!user) {
      throw new Error('User not found');
    }

    const response = await this.httpService.axiosRef
      .get('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${user.encrypted_token}`,
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
        user_id: user._id as ObjectId,
        gh_repository_id: String(repository.id),
        name: repository.name,
        repo_fullname: repository.full_name,
        url: repository.html_url,
        is_private: repository.private,
        created_at: new Date(repository.created_at),
        updated_at: new Date(repository.updated_at),
      }),
    );

    const existingRepositories = await this.findAll(user.github_id);

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
          r => r.gh_repository_id === repository.gh_repository_id,
        )
      ) {
        this.create(repository);
      }
    });

    return repositoriesInserted;
  }
}
