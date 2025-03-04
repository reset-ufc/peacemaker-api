import { decryptToken } from '@/common/utils/encrypt';
import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createRepositoryDto: CreateRepositoryDto) {
    const repository = new this.repositoryModel(createRepositoryDto);
    return repository.save();
  }

  async findAll(githubId: string): Promise<Repository[] | []> {
    const repositories = await this.repositoryModel
      .find({ gh_user_id: githubId })
      .exec();

    if (!repositories) {
      return [];
    }

    return repositories;
  }

  async findOne(repositoryName: string, githubId: string) {
    const repository = await this.repositoryModel
      .findOne({
        name: repositoryName,
        gh_user_id: githubId,
      })
      .exec();

    if (!repository) {
      return null;
    }

    return repository;
  }

  async findRemoteRepositories(githubId: string) {
    const user = await this.userService.findOneByGithubId(githubId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const decrypt_token = decryptToken(user.encrypted_token);

    const response = await this.httpService.axiosRef
      .get('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${decrypt_token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      .then(
        response => response.data as unknown as Array<GithubRepositoryResponse>,
      );

    // TODO: some privates repositories are not saved on the database
    const repositoriesFiltered = response.filter(
      repository =>
        repository.permissions.admin || repository.permissions.maintain,
    );

    const repositoriesToInsert: Repository[] = repositoriesFiltered.map(
      (repository: GithubRepositoryResponse) => ({
        user_id: user._id as ObjectId,
        gh_user_id: String(repository.owner.id),
        gh_repository_id: String(repository.id),
        name: repository.name,
        repo_fullname: repository.full_name,
        url: repository.html_url,
        is_private: repository.private,
        created_at: new Date(repository.created_at),
        updated_at: new Date(repository.updated_at),
      }),
    );

    // Verifica quais repositórios já existem no MongoDB
    const existingRepositories = await this.findAll(user.github_id);

    // Filtra apenas os que ainda não foram inseridos
    const newRepositories = repositoriesToInsert.filter(repo => {
      return !existingRepositories.some(
        (existing: Repository) => existing.repo_fullname === repo.repo_fullname,
      );
    });

    // Insere apenas os novos, se houver
    if (newRepositories.length > 0) {
      await this.repositoryModel.insertMany(newRepositories);
    }

    // Retorna a lista completa atualizada
    return this.findAll(user.github_id);
  }
}
