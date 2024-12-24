import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubOauthModule } from './auth/github/github-oauth.module';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';
import appConfig from './config/app.config';
import { GlobalErrorInterceptor } from './error/global-error.interceptor';
import { GhCommentsModule } from './gh-comments/gh-comments.module';
import { GhRepositoriesModule } from './gh-repositories/gh-repositories.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('databaseUrl'),
      }),
    }),
    GithubOauthModule,
    UserModule,
    GhCommentsModule,
    GhRepositoriesModule,
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalErrorInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
