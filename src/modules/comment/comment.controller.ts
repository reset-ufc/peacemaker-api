import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@Controller('v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':repository_id')
  getComments(@Param('repository_id') repositoryId: string) {
    return this.commentService.findAll(repositoryId);
  }

  @Get(':id')
  getComment(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Post(':repository_id')
  createComment(
    @Param('repository_id') repositoryId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(repositoryId, createCommentDto);
  }

  @Patch(':repository_id/:id')
  updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, updateCommentDto);
  }
}
