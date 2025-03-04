import { IsPublic } from '@/common/decorators/is-public.decorator';
import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Buffer } from 'node:buffer';
import { AuthorizationQueryDto, CallbackQueryDto } from './dto/queries.dto';
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
    @Res() response: Response,
    @Query() authorizationQueryDto: AuthorizationQueryDto,
  ) {
    const stateData = {
      client_type: authorizationQueryDto.client_type,
      redirect_uri: authorizationQueryDto.redirect_uri,
    };
    const state = Buffer.from(JSON.stringify(stateData)).toString('base64url');

    const autorizationUrl = this.githubService.authorization(state);

    return response.status(HttpStatus.OK).json({ url: autorizationUrl });
  }

  @IsPublic()
  @ApiQuery({ name: 'code', type: String })
  @Get('callback')
  async callback(
    @Res() response: Response,
    @Query() callbackQueryDto: CallbackQueryDto,
  ) {
    const token = await this.githubService.callback(callbackQueryDto.code);
    const stateDecoded = JSON.parse(
      Buffer.from(callbackQueryDto.state, 'base64').toString(),
    ) as {
      client_type: string;
      redirect_uri: string;
    };

    if (stateDecoded.client_type !== 'web') {
      return response.status(HttpStatus.OK).json({
        access_token: token,
      });
    } else {
      response.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return response.redirect(stateDecoded.redirect_uri);
    }
  }
}
