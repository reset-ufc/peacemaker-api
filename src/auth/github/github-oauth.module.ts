import { Module } from '@nestjs/common';

import { UserModule } from '@/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { GithubOauthController } from './github-oauth.controller';

@Module({
  imports: [JwtAuthModule, UserModule, HttpModule],
  controllers: [GithubOauthController],
  providers: [],
})
export class GithubOauthModule {}
