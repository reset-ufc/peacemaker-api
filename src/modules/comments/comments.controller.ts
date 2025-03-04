import { IsPublic } from '@/common/decorators/is-public.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @IsPublic()
  @Get('')
  async getComments() {
    const comments = await this.commentService.findAll();

    return { comments };
  }

  @IsPublic()
  @Get('repository/:repository_id')
  async getCommentsByRepositoryId(
    @Param('repository_id') repositoryId: string,
  ) {
    const comments =
      await this.commentService.findAllByRepository(repositoryId);

    return { comments };
  }

  @IsPublic()
  @Get(':id')
  async getComment(@Param('id') id: string) {
    const comment = await this.commentService.findOne(id);

    return { comment };
  }
}
