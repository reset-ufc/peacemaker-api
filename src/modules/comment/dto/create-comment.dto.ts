import { CreateClassificationDto } from '@/modules/classification/dto/create-classification.dto';
import { CreateRepositoryDto } from '@/modules/repository/dto/create-repository.dto';
import { CreateSuggestionDto } from '@/modules/suggestion/dto/create-suggestion.dto';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  comment_or_pull_request_id: string;

  @IsString()
  content: string;

  @ValidateNested()
  @Type(() => CreateRepositoryDto)
  repository: CreateRepositoryDto;

  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @IsNumber()
  toxicity: number;

  @ValidateNested()
  @Type(() => CreateClassificationDto)
  classification: CreateClassificationDto;

  @ValidateNested()
  @Type(() => CreateSuggestionDto)
  suggestion: CreateSuggestionDto;
}
