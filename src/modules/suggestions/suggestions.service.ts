import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Suggestion } from './entities/suggestion.entity';

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectModel(Suggestion.name)
    private readonly suggestionModel: Model<Suggestion>,
  ) {}

  async getAll(): Promise<Suggestion[] | []> {
    const suggestions = await this.suggestionModel.find().exec();

    return suggestions;
  }

  async getAllByRepository(repositoryId: string): Promise<Suggestion[] | []> {
    const suggestions = await this.suggestionModel
      .find({ repository_id: repositoryId })
      .exec();

    return suggestions;
  }

  async getById(id: string): Promise<Suggestion | null> {
    const suggestion = await this.suggestionModel.findOne({ _id: id }).exec();

    return suggestion;
  }
}
