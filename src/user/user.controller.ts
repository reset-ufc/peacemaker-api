import { Body, Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @Post()
  async create(@Res() response: Response, @Body() user: CreateUserDto) {
    const createdUser = await this.service.createUser(user);

    return response.status(HttpStatus.CREATED).json({
      user: createdUser._id,
    });
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'The user profile has been successfully retrieved.',
  })
  @Post('profile')
  async profile(
    @Res() response: Response,
    @Param('githubId') githubId: string,
  ) {
    const user = await this.service.profile(githubId);

    return response.status(HttpStatus.OK).json({
      github_id: user?.github_id,
      name: user?.name,
      avatar_url: user?.avatar_url,
    });
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'All users have been successfully retrieved.',
  })
  @Post('all')
  async getAll(@Res() response: Response) {
    const users = await this.service.getUsers();

    return response.status(HttpStatus.OK).json({
      users,
    });
  }
}
