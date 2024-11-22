import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { GhCommentsService } from './gh-comments.service';
import { CreateGhCommentDto } from './dto/create-gh-comment.dto';
import { UpdateGhCommentDto } from './dto/update-gh-comment.dto';

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
      message: 'Gh-comment created successfully',
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
      message: 'Gh-comments retrieved successfully',
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
      message: 'Gh-comment retrieved successfully',
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
      message: 'Gh-comment updated successfully',
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
      message: 'Gh-comment deleted successfully',
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
  async getAverageScore(@Param('repository_id') repo_id: string) {
    return this.ghCommentsService.getAverageScore(repo_id);
  }

  @ApiOperation({ summary: 'Get median score of comments' })
  @ApiResponse({
    status: 200,
    description:
      'The median score of comments has been successfully retrieved.',
  })
  @Get(':repository_id/median-score/')
  async getMedianScore(@Param('repository_id') repo_id: string) {
    return this.ghCommentsService.getMedianScore(repo_id);
  }

  @ApiOperation({ summary: 'Get total comments of repository' })
  @ApiResponse({
    status: 200,
    description:
      'The total comments of repository has been successfully retrieved.',
  })
  @Get(':repository_id/total-comments/')
  async getTotalComments(@Param('repository_id') repo_id: string) {
    return this.ghCommentsService.getTotalComments(repo_id);
  }

  @ApiOperation({ summary: 'Get resolved comments of repository' })
  @ApiResponse({
    status: 200,
    description:
      'The resolved comments of repository has been successfully retrieved.',
  })
  @Get(':repository_id/resolved-comments/')
  async getResolvedComments(@Param('repository_id') repo_id: string) {
    return this.ghCommentsService.getResolvedComments(repo_id);
  }

  @ApiOperation({ summary: 'Get recent users of repository' })
  @ApiResponse({
    status: 200,
    description:
      'The recent users of repository has been successfully retrieved.',
  })
  @Get(':repository_id/recent-users/')
  async getRecentUsers(@Param('repository_id') repo_id: string) {
    return this.ghCommentsService.getRecentUsers(repo_id);
  }

  @ApiOperation({ summary: 'Get developers count of repository' })
  @ApiResponse({
    status: 200,
    description:
      'The developers count of repository has been successfully retrieved.',
  })
  @Get(':repository_id/developers-count/')
  async getDevelopersCount(@Param('repository_id') repo_id: string) {
    return this.ghCommentsService.getDevelopersCount(repo_id);
  }

  @ApiOperation({ summary: 'Get classification count of repository' })
  @ApiResponse({
    status: 200,
    description:
      'The classification count of repository has been successfully retrieved.',
  })
  @Get(':repository_id/classification-count/')
  async getClassificationCount(@Param('repository_id') repo_id: string) {
    return this.ghCommentsService.getClassificationCount(repo_id);
  }

  @ApiOperation({ summary: 'Get moderation types of repository' })
  @ApiResponse({
    status: 200,
    description:
      'The moderation types of repository has been successfully retrieved.',
  })
  @Get(':repository_id/moderation-types/')
  async getModerationTypes(@Param('repository_id') repo_id: string) {
    return this.ghCommentsService.getModerationTypes(repo_id);
  }

  @ApiOperation({ summary: 'Get likes and dislikes insights of repository' })
  @ApiResponse({
    status: 200,
    description:
      'The likes and dislikes insights of repository has been successfully retrieved.',
  })
  @Get(':repository_id/likes-dislikes-insights/')
  async getLikesDislikesInsights(@Param('repository_id') repo_id: string) {
    return this.ghCommentsService.getLikesDislikesInsights(repo_id);
  }
}
