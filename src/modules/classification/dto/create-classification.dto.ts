import { Sentiment } from '@/modules/classification/entities/classification.entity';
import { IsEnum, IsString } from 'class-validator';

export class CreateClassificationDto {
  @IsString()
  content: string;

  @IsEnum(Sentiment)
  sentiment: Sentiment;
}
