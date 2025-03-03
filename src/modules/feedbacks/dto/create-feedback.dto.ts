import { IsBoolean, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { Feedback } from '../entities/feedback.entity';

export class CreateFeedbackDto extends Feedback {
  readonly suggestion_id: Types.ObjectId;

  @IsBoolean()
  readonly is_useful: boolean;

  @IsString()
  readonly justification: string;
}
