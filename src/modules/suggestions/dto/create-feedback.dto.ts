import { IsEnum, IsString } from 'class-validator';
import { Feedbacks, FeedbackType } from '../entities/feedback.entity';

export class CreateFeedbackDto extends Feedbacks {
  @IsString()
  comment_id: string;

  @IsString()
  suggestion_id: string;

  @IsEnum(Object.values(FeedbackType))
  type: FeedbackType;

  @IsString()
  comment: string;
}
