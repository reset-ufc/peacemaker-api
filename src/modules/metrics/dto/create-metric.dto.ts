import { IsNumber } from 'class-validator';
import { Metric } from '../entities/metric.entity';

export class CreateMetricDto extends Metric {
  @IsNumber()
  readonly suggestions_fully_accepted: number;

  @IsNumber()
  readonly suggestions_partial_accepted: number;

  @IsNumber()
  readonly suggestions_not_accepted: number;

  @IsNumber()
  readonly suggestions_by_owner: number;
}
