import { CreateCommentDto } from '@/modules/comment/dto/create-comment.dto';
import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateSuggestionDto {
  @IsString()
  content: string;

  @ValidateNested()
  @Type(() => CreateCommentDto)
  comment_id: CreateCommentDto;

  @IsNumber()
  likes: number;

  @IsNumber()
  dislikes: number;

  @IsNumber()
  reports: number;
}
