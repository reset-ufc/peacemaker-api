import { JwtAuthModule } from '@/modules/auth/jwt/jwt-auth.module';
import { UserModule } from '@/modules/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
  imports: [UserModule, HttpModule, JwtAuthModule],
  controllers: [GithubController],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
