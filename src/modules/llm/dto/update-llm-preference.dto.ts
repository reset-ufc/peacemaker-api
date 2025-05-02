import { IsOptional, IsString } from 'class-validator';

export class UpdateLlmPreferenceDto {
  @IsString()
  llm_id: string;

  @IsOptional()
  @IsString()
  openai_api_key?: string;

  @IsOptional()
  @IsString()
  groq_api_key?: string;
}
