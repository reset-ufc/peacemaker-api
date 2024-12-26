import { PartialType } from '@nestjs/swagger';
import { CreateGhRepositoryDto } from './create-gh-repository.dto';

export class UpdateGhRepositoryDto extends PartialType(CreateGhRepositoryDto) {}
