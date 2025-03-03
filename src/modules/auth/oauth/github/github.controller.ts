import { IsPublic } from '@/common/decorators/is-public.decorator';
import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { GithubService } from './github.service';

@ApiTags('Github OAuth')
@Controller('oauth/github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @IsPublic()
  @ApiQuery({
    name: 'client_type',
    type: String,
    nullable: true,
    required: false,
  })
  @ApiQuery({
    name: 'redirect_uri',
    type: String,
    nullable: true,
    required: true,
  })
  @Get('')
  autorization(
    @Res({ passthrough: true }) response: Response,
    @Query('client_type') clientType: 'web' | 'extension' = 'web',
    @Query('redirect_uri') redirectUri: string = '',
  ) {
    const stateData = { client_type: clientType, redirect_uri: redirectUri };
    const state = Buffer.from(JSON.stringify(stateData)).toString('base64');

    const autorizationUrl = this.githubService.authorization(state);

    return response.status(HttpStatus.OK).json({
      url: autorizationUrl,
    });
  }

  @IsPublic()
  @ApiQuery({ name: 'code', type: String })
  @Get('callback')
  async callback(
    @Res({ passthrough: true }) response: Response,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    const token = await this.githubService.callback(code);
    const stateDecoded = JSON.parse(
      Buffer.from(state, 'base64').toString(),
    ) as {
      client_type: string;
      redirect_uri: string;
    };

    if (stateDecoded.client_type !== 'web') {
      response.status(HttpStatus.OK).json({
        access_token: token,
      });
    } else {
      response.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      response.redirect(stateDecoded.redirect_uri);
    }
  }
}
