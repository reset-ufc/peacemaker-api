import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { AppService } from './app.service';
import { GithubOauthModule } from './auth/github/github-oauth.module';
import { UserModule } from './user/user.module';
import { GhCommentsModule } from './gh-comments/gh-comments.module';
import appConfig from './config/app.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalErrorInterceptor } from './error/global-error.interceptor';

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
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalErrorInterceptor,
    },
  ],
})
export class AppModule {}
