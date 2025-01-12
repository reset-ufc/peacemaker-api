import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Suggestion } from './entities/suggestion.entity';

@Injectable()
export class SuggestionService {
  constructor(
    @InjectModel(Suggestion.name)
    private readonly suggestionModel: Model<Suggestion>,
  ) {}
}
