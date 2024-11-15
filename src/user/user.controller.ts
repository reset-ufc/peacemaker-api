import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Get('findById/:id')
  get(@Param('id') id: number) {
    return this.service.findUserByGithubId(Number(id));
  }

  @Post('create')
  create(@Body() user: User) {
    return this.service.createUser(user);
  }

  @Put('update')
  update(@Body() user: User) {
    return this.service.updateUser(user);
  }

  /*@Delete('delete/:id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }*/
}

/*import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @IsPublic()
  @Post('user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
*/
