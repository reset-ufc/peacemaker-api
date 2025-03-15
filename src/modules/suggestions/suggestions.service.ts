// eslint-disable-next-line prettier/prettier
import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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

  async findByComment(commentId: string): Promise<Suggestion[] | []> {
    const suggestionsDocs = await this.suggestionModel
      .find({ gh_comment_id: commentId })
      .exec();

    const filteredSuggestions = suggestionsDocs.map(doc => {
      const suggestionObj = doc.toObject();
      suggestionObj.suggestions = suggestionObj.suggestions.filter(
        (sug: { content: string; rejected?: boolean }) => !sug.rejected,
      );
      return suggestionObj;
    });

    return filteredSuggestions;
  }

  async getById(id: string): Promise<Suggestion | null> {
    const suggestion = await this.suggestionModel.findOne({ _id: id }).exec();

    return suggestion;
  }

  async rejectSuggestion(
    commentId: string,
    suggestionIndex: number,
  ): Promise<{ status: number; message: string }> {
    const suggestionDoc = await this.suggestionModel.findOne({
      gh_comment_id: commentId,
    });
    if (!suggestionDoc) {
      throw new NotFoundException('Suggestion record not found');
    }

    if (
      suggestionIndex < 0 ||
      suggestionIndex >= suggestionDoc.suggestions.length
    ) {
      throw new BadRequestException('Invalid suggestion index');
    }

    suggestionDoc.suggestions[suggestionIndex].rejected = true;
    await suggestionDoc.save();

    return {
      status: HttpStatus.OK,
      message: 'Suggestion rejected successfully',
    };
  }
}
