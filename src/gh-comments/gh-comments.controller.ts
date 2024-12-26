import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CreateGhCommentDto } from './dto/create-gh-comment.dto';
import { UpdateGhCommentDto } from './dto/update-gh-comment.dto';
import { GhCommentsService } from './gh-comments.service';

@ApiBearerAuth()
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
  async create(@Res() response: Response, @Body() createGhCommentDto: CreateGhCommentDto) {
    const createdGhComment = await this.ghCommentsService.create(createGhCommentDto);

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
    const updatedGhComment = await this.ghCommentsService.update(id, updateGhCommentDto);

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

  // New Analytics
  @ApiOperation({ summary: 'Analytics of a repository' })
  @ApiResponse({
    status: 200,
    description: 'The analytics of a repository has been successfully retrieved.',
  })
  @Get(':repository_id/analytics/')
  async getAnalytics(@Res() response: Response, @Param('repository_id') repo_id: string) {
    const averageScore = await this.ghCommentsService.getAverageScore(repo_id);
    const medianScore = await this.ghCommentsService.getMedianScore(repo_id);
    const totalComments = await this.ghCommentsService.getTotalComments(repo_id);
    const resolvedComments = await this.ghCommentsService.getResolvedComments(repo_id);
    const recentUsers = await this.ghCommentsService.getRecentUsers(repo_id);
    const developersCount = await this.ghCommentsService.getDevelopersCount(repo_id);
    const classificationCount = await this.ghCommentsService.getClassificationCount(repo_id);
    const moderationTypes = await this.ghCommentsService.getModerationTypes(repo_id);
    const likesDislikesInsights = await this.ghCommentsService.getLikesDislikesInsights(repo_id);

    return response.status(HttpStatus.OK).json({
      average_score: averageScore,
      median_score: medianScore,
      total_comments: totalComments,
      resolved_comments: resolvedComments,
      recent_users: recentUsers,
      developers_count: developersCount,
      classification_count: classificationCount,
      moderation_types: moderationTypes,
      likes_dislikes_insights: likesDislikesInsights,
    });
  }
}
