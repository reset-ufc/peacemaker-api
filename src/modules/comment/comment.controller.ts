import { IsPublic } from '@/common/decorators/is-public.decorator';
import { UserService } from '@/modules/user/user.service';
import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CommentService } from './comment.service';

@ApiTags('Comments')
@Controller('v1/comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
  ) {}

  @IsPublic()
  @Get(':username')
  async getComments(
    @Res() response: Response,
    @Param('username') username: string,
  ) {
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      return response.status(HttpStatus.UNAUTHORIZED).send();
    }

    const comments = await this.commentService.findAll();

    return response.status(HttpStatus.OK).json(comments);
  }

  @IsPublic()
  @Get(':username/:repository_id')
  async getCommentsByRepositoryId(
    @Res() response: Response,
    @Param('username') username: string,
    @Param('repository_id') repositoryId: string,
  ) {
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      return response.status(HttpStatus.UNAUTHORIZED).send();
    }

    const comments =
      await this.commentService.findAllByRepository(repositoryId);
    return response.status(HttpStatus.OK).json(comments);
  }

  // @IsPublic()
  // @Get(':username/:repository_id/toxic-comments')
  // getToxicComments(@Param('repository_id') repositoryId: string) {
  //   return this.commentService.findToxicComments(repositoryId);
  // }

  @IsPublic()
  @Get(':username/:id')
  async getComment(
    @Res() response: Response,
    @Param('username') username: string,
    @Param('id') id: string,
  ) {
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      return response.status(HttpStatus.UNAUTHORIZED).send();
    }

    const comment = await this.commentService.findOne(id);

    return response.status(HttpStatus.OK).json(comment);
  }

  // @Post(':repository_id')
  // createComment(
  //   @Param('repository_id') repositoryId: string,
  //   @Body() createCommentDto: CreateCommentDto,
  // ) {
  //   return this.commentService.create(repositoryId, createCommentDto);
  // }

  // @Patch(':repository_id/:id')
  // updateComment(@Param('id') id: string, @Body() body: { content: string }) {
  //   return { id, content: body.content };
  // }

  // @Patch(':id')
  // async editComment(
  //   @Param('id') commentId: string,
  //   @Body() body: { content: string; owner: string; repo: string },
  // ) {
  //   if (!body.content) {
  //     throw new Error('Content cannot be empty.');
  //   }

  //   return await this.commentService.editComment(
  //     commentId,
  //     body.content,
  //     body.owner,
  //     body.repo,
  //   );
  // }

  // @Delete(':repository_id/:id')
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // deleteComment(@Param('id') id: string) {
  //   return { message: 'Comment deleted successfully' };
  // }
}
