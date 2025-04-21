import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedbacks } from './entities/feedback.entity';
import { Suggestions } from './entities/suggestion.entity';

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectModel(Suggestions.name)
    private readonly suggestionsModel: Model<Suggestions>,

    @InjectModel(Feedbacks.name)
    private readonly feedbacksModel: Model<Feedbacks>,
  ) {}

  async findAllByComment(id: string) {
    const suggestions = await this.suggestionsModel.find({
      gh_comment_id: id,
      is_rejected: false,
    });
    return suggestions;
  }

  async findOne(id: string) {
    const suggestion = await this.suggestionsModel.findOne({
      gh_comment_id: id,
    });

    return suggestion;
  }

  async feedback(createFeedbackDto: CreateFeedbackDto) {
    const feedback = await this.feedbacksModel.create(createFeedbackDto);

    return feedback;
  }

  async edit(suggestion_id: string, content: string) {
    const suggestion = await this.suggestionsModel.findOne({
      _id: suggestion_id,
    });

    if (!suggestion) {
      return null;
    }

    suggestion.content = content;
    suggestion.is_edited = true;
    await suggestion.save();

    return suggestion;
  }

  async rejectCommentSuggestion(suggestion_id: string) {
    const suggestion = await this.suggestionsModel.findOne({
      _id: suggestion_id,
    });

    if (!suggestion) {
      return null;
    }

    suggestion.is_rejected = true;
    await suggestion.save();

    return {
      message: 'Suggestion rejected successfully',
    };
  }
}
