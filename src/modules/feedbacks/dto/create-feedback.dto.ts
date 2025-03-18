import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  suggestion_id: string;

  @IsBoolean()
  is_useful: boolean;

  // Se o feedback não for útil, a justificativa é obrigatória
  @ValidateIf(o => o.is_useful === false)
  @IsString()
  @IsNotEmpty({
    message: 'Justification is required when feedback is not useful',
  })
  justification?: string;
}
