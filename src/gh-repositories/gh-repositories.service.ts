import { Injectable } from '@nestjs/common';

@Injectable()
export class GhRepositoriesService {
  constructor() {}

  async getRepositories() {
    return [];
  }
}
