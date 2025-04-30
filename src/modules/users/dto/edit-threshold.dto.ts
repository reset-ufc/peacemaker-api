import { IsNumber } from 'class-validator';

export class EditThresholdDto {
  @IsNumber()
  threshold: number;
}
