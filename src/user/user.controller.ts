import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  // @IsPublic()
  // @ApiOperation({ summary: 'Create user' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'The user has been successfully created.',
  // })
  // @Post()
  // async create(@Res() response: Response, @Body() user: CreateUserDto) {
  //   const createdUser = await this.service.createUser(user);

  //   return response.status(HttpStatus.CREATED).json({
  //     user: createdUser._id,
  //   });
  // }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'The user profile has been successfully retrieved.',
  })
  @Get('profile')
  async profile(@Res() response: Response, @CurrentUser() user: User) {
    const userData = await this.service.profile(String(user.github_id));

    const profile = {
      name: userData?.name,
      email: userData?.email,
      github_id: userData?.github_id,
      avatar_url: userData?.avatar_url,
      username: userData?.login,
    };

    return response.status(HttpStatus.OK).json({
      profile,
    });
  }
}
