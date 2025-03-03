import { IsPublic } from '@/common/decorators/is-public.decorator';
import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CommentsService } from './comments.service';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @IsPublic()
  @Get('')
  async getComments(@Res() response: Response) {
    const comments = await this.commentService.findAll();

    return response.status(HttpStatus.OK).json(comments);
  }

  @IsPublic()
  @Get(':repository_id')
  async getCommentsByRepositoryId(
    @Res() response: Response,
    @Param('repository_id') repositoryId: string,
  ) {
    const comments =
      await this.commentService.findAllByRepository(repositoryId);
    return response.status(HttpStatus.OK).json(comments);
  }

  @IsPublic()
  @Get(':id')
  async getComment(@Res() response: Response, @Param('id') id: string) {
    const comment = await this.commentService.findOne(id);

    return response.status(HttpStatus.OK).json(comment);
  }
}
