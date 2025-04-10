import { SuggestionsService } from '@/modules/suggestions/suggestions.service';
import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtPayload } from '../auth/jwt/entities/jwt.entity';
import { CommentsService } from './comments.service';
import { AcceptCommentSuggestionDto } from './dto/accept-suggestion.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly suggestionsService: SuggestionsService,
  ) {}

  @Get()
  async findAll(@Req() request: Request, @Res() response: Response) {
    const user = request?.user as JwtPayload['user'];

    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const comments = await this.commentsService.findAll(user.github_id);

    console.log(comments);

    return response.status(200).json({ comments });
  }

  @ApiParam({ name: 'comment_id', type: String })
  @Get(':comment_id')
  async findOne(
    @Req() request: Request,
    @Res() response: Response,
    @Param('comment_id') commentId: string,
  ) {
    const user = request?.user as JwtPayload['user'];
    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const comment = await this.commentsService.findOne(
      commentId,
      user.github_id,
    );

    return response.status(200).json({ comment });
  }

  @ApiParam({ name: 'comment_id', type: String })
  @Get(':comment_id/suggestions')
  async findSuggestions(
    @Res() response: Response,
    @Param('comment_id') commentId: string,
  ) {
    const suggestions =
      await this.suggestionsService.findAllByComment(commentId);

    if (await this.commentsService.verifySolutioned(commentId)) {
      return response.status(400).json({ message: 'Comment solutioned' });
    }

    return response.status(200).json({ suggestions });
  }

  @ApiParam({ name: 'comment_id', type: String })
  @ApiParam({ name: 'suggestion_id', type: String })
  @Post(':comment_id/suggestions/:suggestion_id/accept')
  async acceptCommentSuggestion(
    @Req() request: Request,
    @Res() response: Response,
    @Param('comment_id') commentId: string,
    @Param('suggestion_id') suggestionId: string,
    @Body() acceptCommentSuggestionDto: AcceptCommentSuggestionDto,
  ) {
    const user = request?.user as JwtPayload['user'];

    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const comment = await this.commentsService.acceptCommentSuggestion(
      commentId,
      user.github_id,
      suggestionId,
      acceptCommentSuggestionDto,
    );

    return response.status(200).json({ comment });
  }
}
