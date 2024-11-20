import { Module } from '@nestjs/common';

import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { GithubOauthController } from './github-oauth.controller';
import { GithubOauthStrategy } from './github-oauth.strategy';
import { UserModule } from '@/user/user.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [JwtAuthModule, UserModule, HttpModule],
  controllers: [GithubOauthController],
  providers: [GithubOauthStrategy],
})
export class GithubOauthModule {}
