import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully created.',
  })
  @Post()
  async create(@Body() user: CreateUserDto) {
    return this.service.createUser(user);
  }
}
