import { IsBoolean, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { Suggestion } from '../entities/suggestion.entity';

export class CreateSuggestionDto extends Suggestion {
  readonly comment_id: Types.ObjectId;

  @IsString()
  readonly text: string;

  @IsBoolean()
  readonly is_edited: boolean;

  @IsBoolean()
  readonly is_selected: boolean;
}
