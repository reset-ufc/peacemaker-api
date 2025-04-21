import { Model as LlmModel } from '@/enums/models';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateLlmPreferenceDto {
  @IsEnum(LlmModel)
  llm_id: LlmModel;

  @IsOptional()
  @IsString()
  openai_api_key?: string;

  @IsOptional()
  @IsString()
  groq_api_key?: string;
}
