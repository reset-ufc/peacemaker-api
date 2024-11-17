import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  create(@Body() createGhCommentDto: CreateGhCommentDto) {
    return this.ghCommentsService.create(createGhCommentDto);
  }

  @ApiOperation({ summary: 'Get all gh-comments' })
  @ApiResponse({
    status: 200,
    description: 'The gh-comments have been successfully retrieved.',
  })
  @Get()
  findAll() {
    return this.ghCommentsService.findAll();
  }

  @ApiOperation({ summary: 'Get a gh-comment by id' })
  @ApiResponse({
    status: 200,
    description: 'The gh-comment has been successfully retrieved.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ghCommentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a gh-comment by id' })
  @ApiResponse({
    status: 200,
    description: 'The gh-comment has been successfully updated.',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGhCommentDto: UpdateGhCommentDto,
  ) {
    return this.ghCommentsService.update(id, updateGhCommentDto);
  }

  @ApiOperation({ summary: 'Delete a gh-comment by id' })
  @ApiResponse({
    status: 200,
    description: 'The gh-comment has been successfully deleted.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ghCommentsService.remove(id);
  }
}
