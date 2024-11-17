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

@ApiTags('gh-comments')
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
  @Get(':id')
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
  @Patch(':id')
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
  @Delete(':id')
  async remove(@Res() response: Response, @Param('id') id: string) {
    const deletedGhComment = await this.ghCommentsService.remove(id);

    return response.status(HttpStatus.OK).json({
      message: 'Gh-comment deleted successfully',
      id: deletedGhComment?._id,
    });
  }
}
