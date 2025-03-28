import { IsBoolean, IsString } from 'class-validator';

export class AcceptCommentSuggestionDto {
  @IsString()
  suggestion_content: string;

  @IsBoolean()
  is_edited: boolean;
}
