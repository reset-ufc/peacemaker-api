import { JwtAuthModule } from '@/modules/auth/jwt/jwt-auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
  imports: [UsersModule, HttpModule, JwtAuthModule],
  controllers: [GithubController],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
