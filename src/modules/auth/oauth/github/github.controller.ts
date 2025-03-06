import { IsPublic } from '@/common/decorators/is-public.decorator';
import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
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

    try {
      new URL(stateData.redirect_uri);
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error.message);
    }

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
      Buffer.from(callbackQueryDto.state, 'base64url').toString(),
    ) as {
      client_type: string;
      redirect_uri: string;
    };

    try {
      new URL(stateDecoded.redirect_uri);
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error.message);
    }

    if (stateDecoded.client_type === 'extension') {
      return response.redirect(
        `${stateDecoded.redirect_uri}?access_token=${token}`,
      );
    } else if (stateDecoded.client_type === 'web') {
      response.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return response.redirect(stateDecoded.redirect_uri);
    } else {
      return { access_token: token };
    }
  }
}
