import { IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';
import { Suggestion } from '../entities/suggestion.entity';

export class CreateSuggestionDto extends Suggestion {
  @IsBoolean()
  readonly is_edited: boolean;

  @IsString()
  gh_comment_id: string;

  @IsNumber()
  suggestion_selected_index: number;

  @IsObject()
  suggestions: { content: string }[];
}
