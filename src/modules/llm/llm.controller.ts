import {
  Model, ModelProvider, contextWindowMap,
  maxCompletionTokensMap, modelProviderMap
} from '@/enums/models';
import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Llms')
@Controller('llms')
export class LlmsController {
  @Get('models')
  getModels(@Req() req: Request): {
    name: string;
    provider: ModelProvider;
    contextWindow?: number;
    maxCompletionTokens?: number;
  }[] {
    return Object.values(Model).map((model) => ({
      name: model,
      provider: modelProviderMap[model],
      contextWindow: contextWindowMap[model],
      maxCompletionTokens: maxCompletionTokensMap[model],
    }));
  }
}