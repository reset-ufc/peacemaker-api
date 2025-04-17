import { Module } from '@nestjs/common';
import { LlmsController } from './llm.controller';

@Module({
  imports: [],
  // providers: [RepositoriesService],
  controllers: [LlmsController],
  // exports: [RepositoriesService],
})
export class LlmModule {}
