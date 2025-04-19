import {
  Model,
  contextWindowMap,
  maxCompletionTokensMap,
  modelProviderMap,
} from '@/enums/models';

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtPayload } from '../auth/jwt/entities/jwt.entity';
import { UpdateLlmPreferenceDto } from './dto/update-llm-preference.dto';
import { LlmsService } from './llm.service';

@ApiTags('Llms')
@Controller('llms')
export class LlmsController {
  constructor(private readonly llmsService: LlmsService) {}
  @Get('models')
  getModels(): any {
    return {
      models: Object.values(Model).map(model => ({
        name: model,
        provider: modelProviderMap[model],
        contextWindow: contextWindowMap[model],
        maxCompletionTokens: maxCompletionTokensMap[model],
      })),
    };
  }

  @Patch('preference')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePreference(
    @Req() req: Request,
    @Res() response: Response,
    @Body() dto: UpdateLlmPreferenceDto,
  ): Promise<void> {
    const user = req?.user as JwtPayload['user'] | undefined;

    if (!user || !user.github_id) {
      response.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await this.llmsService.updateUserPreference(user.github_id, dto);
    response.status(204).send();
  }
}
