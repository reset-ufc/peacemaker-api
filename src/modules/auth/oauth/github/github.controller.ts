import { IsPublic } from '@/common/decorators/is-public.decorator';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { GithubService } from './github.service';

@ApiTags('Github OAuth')
@Controller('v1/oauth/github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @IsPublic()
  @ApiQuery({
    name: 'callback_url',
    type: String,
    nullable: true,
    required: false,
  })
  @Get('')
  autorization(@Query('callback_url') callbackUrl?: string) {
    const autorizationUrl = this.githubService.authorization(callbackUrl);
    return autorizationUrl;
  }

  @IsPublic()
  @ApiQuery({ name: 'code', type: String })
  @Get('callback')
  async callback(
    @Res({ passthrough: true }) response: Response,
    @Query('code') code: string,
  ) {
    const token = await this.githubService.callback(code);

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    response.setHeader('Autorization', `Bearer ${token}`);

    return { token };
  }
}
