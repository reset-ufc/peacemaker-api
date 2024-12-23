import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CreateGhCommentDto } from './dto/create-gh-comment.dto';
import { UpdateGhCommentDto } from './dto/update-gh-comment.dto';
import { GhCommentsService } from './gh-comments.service';

@ApiTags('Github Comments')
@Controller('gh-comments')
export class GhCommentsController {
  constructor(private readonly ghCommentsService: GhCommentsService) {}

  @ApiOperation({ summary: 'Create a new gh-comment' })
  @ApiResponse({
    status: 201,
    description: 'The gh-comment has been successfully created.',
  })
  @Post()
  async create(
    @Res() response: Response,
    @Body() createGhCommentDto: CreateGhCommentDto,
  ) {
    const createdGhComment =
      await this.ghCommentsService.create(createGhCommentDto);

    return response.status(HttpStatus.CREATED).json({
      id: createdGhComment._id,
    });
  }

  @ApiOperation({ summary: 'Get all gh-comments' })
  @ApiResponse({
    status: 200,
    description: 'The gh-comments have been successfully retrieved.',
  })
  @Get()
  async findAll(@Res() response: Response) {
    const ghComments = await this.ghCommentsService.findAll();

    return response.status(HttpStatus.OK).json({
      comments: ghComments,
    });
  }

  @ApiOperation({ summary: 'Get a gh-comment by id' })
  @ApiResponse({
    status: 200,
    description: 'The gh-comment has been successfully retrieved.',
  })
  @Get(':repository_id')
  async findOne(@Res() response: Response, @Param('id') id: string) {
    const ghComment = await this.ghCommentsService.findOne(id);

    return response.status(HttpStatus.OK).json({
      comments: ghComment,
    });
  }

  @ApiOperation({ summary: 'Update a gh-comment by id' })
  @ApiResponse({
    status: 200,
    description: 'The gh-comment has been successfully updated.',
  })
  @Patch(':repository_id')
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateGhCommentDto: UpdateGhCommentDto,
  ) {
    const updatedGhComment = await this.ghCommentsService.update(
      id,
      updateGhCommentDto,
    );

    return response.status(HttpStatus.OK).json({
      id: updatedGhComment?._id,
    });
  }

  @ApiOperation({ summary: 'Delete a gh-comment by id' })
  @ApiResponse({
    status: 200,
    description: 'The gh-comment has been successfully deleted.',
  })
  @Delete(':repository_id')
  async remove(@Res() response: Response, @Param('id') id: string) {
    const deletedGhComment = await this.ghCommentsService.remove(id);

    return response.status(HttpStatus.OK).json({
      id: deletedGhComment?._id,
    });
  }

  // Analytics
  @ApiOperation({ summary: 'Get average score of comments' })
  @ApiResponse({
    status: 200,
    description:
      'The average score of comments has been successfully retrieved.',
  })
  @Get(':repository_id/average-score')
  async getAverageScore(
    @Res() response: Response,
    @Param('repository_id') repo_id: string,
  ) {
    const averageScore = await this.ghCommentsService.getAverageScore(repo_id);

    return response.status(HttpStatus.OK).json({
      avarege_score: averageScore,
    });
  }

  @ApiOperation({ summary: 'Get median score of comments' })
  @ApiResponse({
    status: 200,
    description:
      'The median score of comments has been successfully retrieved.',
  })
  @Get(':repository_id/median-score/')
  async getMedianScore(
    @Res() response: Response,
    @Param('repository_id') repo_id: string,
  ) {
    const medianScore = this.ghCommentsService.getMedianScore(repo_id);

    return response.status(HttpStatus.OK).json({
      median_score: medianScore,
    });
  }

  @ApiOperation({ summary: 'Get total comments of repository' })
  @ApiResponse({
    status: 200,
    description:
      'The total comments of repository has been successfully retrieved.',
  })
  @Get(':repository_id/total-comments/')
  async getTotalComments(
    @Res() response: Response,
    @Param('repository_id') repo_id: string,
  ) {
    const totalComments =
      await this.ghCommentsService.getTotalComments(repo_id);

    return response.status(HttpStatus.OK).json({
      total_comments: totalComments,
    });
  }

  @ApiOperation({ summary: 'Get resolved comments of repository' })
  @ApiResponse({
    status: 200,
    description:
      'The resolved comments of repository has been successfully retrieved.',
  })
  @Get(':repository_id/resolved-comments/')
  async getResolvedComments(
    @Res() response: Response,
    @Param('repository_id') repo_id: string,
  ) {
    const resolvedComments =
      await this.ghCommentsService.getResolvedComments(repo_id);

    return response.status(HttpStatus.OK).json({
      resolved_comments: resolvedComments,
    });
  }

  @ApiOperation({ summary: 'Get recent users of repository' })
  @ApiResponse({
    status: 200,
    description:
      'The recent users of repository has been successfully retrieved.',
  })
  @Get(':repository_id/recent-users/')
  async getRecentUsers(
    @Res() response: Response,
    @Param('repository_id') repo_id: string,
  ) {
    const recentUsers = await this.ghCommentsService.getRecentUsers(repo_id);

    return response.status(HttpStatus.OK).json({
      recent_users: recentUsers,
    });
  }

  @ApiOperation({ summary: 'Get developers count of repository' })
  @ApiResponse({
    status: 200,
    description:
      'The developers count of repository has been successfully retrieved.',
  })
  @Get(':repository_id/developers-count/')
  async getDevelopersCount(
    @Res() response: Response,
    @Param('repository_id') repo_id: string,
  ) {
    const developersCount =
      await this.ghCommentsService.getDevelopersCount(repo_id);

    return response.status(HttpStatus.OK).json({
      developers_count: developersCount,
    });
  }

  @ApiOperation({ summary: 'Get classification count of repository' })
  @ApiResponse({
    status: 200,
    description:
      'The classification count of repository has been successfully retrieved.',
  })
  @Get(':repository_id/classification-count/')
  async getClassificationCount(
    @Res() response: Response,
    @Param('repository_id') repo_id: string,
  ) {
    const classificationCount =
      await this.ghCommentsService.getClassificationCount(repo_id);

    return response.status(HttpStatus.OK).json({
      classification_count: classificationCount,
    });
  }

  @ApiOperation({ summary: 'Get moderation types of repository' })
  @ApiResponse({
    status: 200,
    description:
      'The moderation types of repository has been successfully retrieved.',
  })
  @Get(':repository_id/moderation-types/')
  async getModerationTypes(
    @Res() response: Response,
    @Param('repository_id') repo_id: string,
  ) {
    const moderationTypes =
      await this.ghCommentsService.getModerationTypes(repo_id);

    return response.status(HttpStatus.OK).json({
      moderation_types: moderationTypes,
    });
  }

  @ApiOperation({ summary: 'Get likes and dislikes insights of repository' })
  @ApiResponse({
    status: 200,
    description:
      'The likes and dislikes insights of repository has been successfully retrieved.',
  })
  @Get(':repository_id/likes-dislikes-insights/')
  async getLikesDislikesInsights(
    @Res() response: Response,
    @Param('repository_id') repo_id: string,
  ) {
    const insights =
      await this.ghCommentsService.getLikesDislikesInsights(repo_id);

    return response.status(HttpStatus.OK).json({
      insights,
    });
  }
}
