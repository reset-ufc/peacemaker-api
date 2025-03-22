import { Parents } from '@/modules/comments/entities/parent.entity';
import { AccountCreatedEvent } from '@/modules/users/create-account.event';
import { UsersService } from '@/modules/users/users.service';
import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comments } from '../comments/entities/comment.entity';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { GithubRepositoryResponse } from './entities/repositories-reponse.entity';
import { Repository } from './entities/repository.entity';

@Injectable()
export class RepositoriesService {
  constructor(
    @InjectModel(Repository.name)
    private readonly repositoryModel: Model<Repository>,
    @InjectModel(Comments.name)
    private readonly commentsModel: Model<Comments>,
    @InjectModel(Parents.name)
    private readonly parentsModel: Model<Parents>,
    private readonly userService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  async create(createRepositoryDto: CreateRepositoryDto) {
    const repository = new this.repositoryModel(createRepositoryDto);
    return repository.save();
  }

  async findAll(userGithubId: string): Promise<Repository[] | []> {
    const repositories = await this.repositoryModel
      .find({ owner_gh_id: userGithubId })
      .exec();

    return repositories;
  }

  async findOne(repositoryName: string, userGithubId: string) {
    const repository = await this.repositoryModel
      .findOne({
        name: repositoryName,
        owner_gh_id: userGithubId,
      })
      .exec();

    return repository;
  }

  async findAllByRepository(repositoryName: string, userGithubId: string) {
    const repository = await this.repositoryModel.findOne({
      name: repositoryName,
      owner_gh_id: userGithubId,
    });

    if (!repository) {
      return null;
    }

    const repositoryComments = await this.commentsModel.find({
      owner_gh_id: userGithubId,
      gh_repository_id: repository.gh_repository_id,
    });

    return repositoryComments;
  }

  async findAllByIssues(repositoryName: string, userGithubId: string) {
    const repository = await this.repositoryModel.findOne({
      name: repositoryName,
      owner_gh_id: userGithubId,
    });

    if (!repository) {
      return null;
    }

    const repositoryIssues = await this.parentsModel.find();

    return repositoryIssues;
  }

  async findIssueByRepository(
    repositoryName: string,
    issueId: string,
    userGithubId: string,
  ) {
    const repository = await this.repositoryModel.findOne({
      name: repositoryName,
      owner_gh_id: userGithubId,
    });

    if (!repository) {
      return null;
    }

    const repositoryIssues = await this.parentsModel.find({
      gh_parent_id: issueId,
    });

    return repositoryIssues;
  }

  @OnEvent('account.created')
  async findRemoteRepositories(event: AccountCreatedEvent) {
    const user = await this.userService.findOneByGithubId(event.githubUserId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // const decrypt_token = decryptToken(user.encrypted_token);

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
      repository =>
        repository.permissions.admin ||
        repository.permissions.maintain ||
        repository.permissions.push ||
        repository.permissions.triage,
    );

    const repositoriesToInsert: Repository[] = repositoriesFiltered.map(
      (repository: GithubRepositoryResponse) => ({
        owner_gh_id: String(repository.owner.id),
        gh_repo_fullname: repository.full_name,
        gh_repository_id: String(repository.id),
        gh_url: repository.html_url,
        name: repository.name,
        private: repository.private,
        created_at: new Date(repository.created_at),
      }),
    );

    // Verifica quais repositórios já existem no MongoDB
    const existingRepositories = await this.findAll(user.gh_user_id);

    // Filtra apenas os que ainda não foram inseridos
    const newRepositories = repositoriesToInsert.filter(repo => {
      return !existingRepositories.some(
        (existing: Repository) =>
          existing.gh_repo_fullname === repo.gh_repo_fullname,
      );
    });

    // Insere apenas os novos, se houver
    if (newRepositories.length > 0) {
      await this.repositoryModel.insertMany(newRepositories);
    }

    // Retorna a lista completa atualizada
    return this.findAll(user.gh_user_id);
  }
}
