// src/llms/llms.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model as MongooseModel } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.entity';
import { UpdateLlmPreferenceDto } from './dto/update-llm-preference.dto';

@Injectable()
export class LlmsService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: MongooseModel<UserDocument>,
  ) {}

  async updateUserPreference(
    userGithubId: string,
    dto: UpdateLlmPreferenceDto,
  ) {
    const user = await this.userModel.findOneAndUpdate(
      { gh_user_id: userGithubId },
      {
        llm_id: dto.llm_id,
        openai_api_key: dto.openai_api_key,
        groq_api_key: dto.groq_api_key,
      },
      { new: true },
    );
    console.log(user);
    if (!user) throw new NotFoundException('User not found');
  }
}
