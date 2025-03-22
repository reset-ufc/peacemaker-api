import { IsBoolean, IsDateString, IsString } from 'class-validator';
import { Suggestions } from '../entities/suggestion.entity';

export class CreateSuggestionDto extends Suggestions {
  @IsString()
  gh_comment_id: string;

  @IsString()
  content: string;

  @IsBoolean()
  is_edited: boolean;

  @IsDateString()
  created_at: Date;
}
