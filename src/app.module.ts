import { ConfigSetupModule } from './config/configure.module';
import { CoreModule } from './core/core.module';

import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AnalyticsController } from './modules/analytics/analytics.controller';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { JwtAuthModule } from './modules/auth/jwt/jwt-auth.module';
import { JwtAuthStrategy } from './modules/auth/jwt/jwt-auth.strategy';
import { GithubController } from './modules/auth/oauth/github/github.controller';
import { GithubModule } from './modules/auth/oauth/github/github.module';
import { CommentController } from './modules/comment/comment.controller';
import { CommentModule } from './modules/comment/comment.module';
import { RepositoryController } from './modules/repository/repository.controller';
import { RepositoryModule } from './modules/repository/repository.module';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigSetupModule,
    CoreModule,
    UsersModule,
    GithubModule,
    CommentModule,
    // TODO: Maybe we should delete this module
    // ClassificationModule,
    // TODO: Maybe we should delete this module
    // SuggestionModule,
    RepositoryModule,
    AnalyticsModule,
    JwtAuthModule,
  ],
  controllers: [
    UsersController,
    GithubController,
    AnalyticsController,
    CommentController,
    // TODO: Maybe we should delete this module
    // ClassificationController,
    // TODO: Maybe we should delete this module
    // SuggestionController,
    RepositoryController,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtAuthStrategy,
  ],
})
export class AppModule {}
