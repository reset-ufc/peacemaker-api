import { PartialType } from '@nestjs/swagger';
import { CreateGhCommentDto } from './create-gh-comment.dto';

export class UpdateGhCommentDto extends PartialType(CreateGhCommentDto) {}
