import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { LlmsController } from './llm.controller';
import { LlmsService } from './llm.service';

@Module({
  imports: [UsersModule],
  providers: [LlmsService],
  controllers: [LlmsController],
  exports: [LlmsService],
})
export class LlmModule {}
