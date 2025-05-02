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
import { fetchGroqModels, fetchOpenAIModels } from 'src/enums/models';
import { JwtPayload } from '../auth/jwt/entities/jwt.entity';
import { UsersService } from '../users/users.service';
import { UpdateLlmPreferenceDto } from './dto/update-llm-preference.dto';
import { LlmsService } from './llm.service';

@ApiTags('Llms')
@Controller('llms')
export class LlmsController {
  constructor(
    private readonly llmsService: LlmsService,
    private readonly userService: UsersService,
  ) {}

  @Get('models')
  async getModels(@Req() req: Request): Promise<any> {
    const payload = req?.user as JwtPayload['user'] | undefined;

    if (!payload?.github_id) {
      return {
        models: [],
        error: 'Usuário não autenticado.',
      };
    }

    const user = await this.userService.findOneByGithubId(payload.github_id);
    if (!user) {
      return {
        models: [],
        error: 'Usuário não encontrado.',
      };
    }

    if (!user.groq_api_key && !user.openai_api_key) {
      return {
        models: [],
        error: 'Chave de API do usuário ausente.',
      };
    }

    const [groqModels, openAiModels] = await Promise.all([
      user.groq_api_key ? fetchGroqModels(user.groq_api_key) : [],
      user.openai_api_key ? fetchOpenAIModels(user.openai_api_key) : [],
    ]);

    const allModels = [...groqModels, ...openAiModels];

    const normalized = allModels.map(model => ({
      id: model.id,
      provider: model.owned_by.includes('openai') ? 'openai' : 'groq',
      contextWindow: model.context_window ?? 6000,
    }));

    return { models: normalized };
  }

  @Patch('preference')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePreference(
    @Req() req: Request,
    @Res() response: Response,
    @Body() dto: UpdateLlmPreferenceDto,
  ): Promise<void> {
    const payload = req?.user as JwtPayload['user'] | undefined;

    if (!payload?.github_id) {
      response.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await this.llmsService.updateUserPreference(payload.github_id, dto);
    response.status(204).send();
  }
}