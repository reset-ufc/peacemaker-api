import { ConfigSetupModule } from './config/configure.module';
import { CoreModule } from './core/core.module';

import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AnalyticsModule } from './modules/analytics/analytic.module';
import { AnalyticsController } from './modules/analytics/analytics.controller';
import { JwtAuthModule } from './modules/auth/jwt/jwt-auth.module';
import { GithubController } from './modules/auth/oauth/github/github.controller';
import { GithubModule } from './modules/auth/oauth/github/github.module';
import { ClassificationController } from './modules/classification/classification.controller';
import { ClassificationModule } from './modules/classification/classification.module';
import { CommentController } from './modules/comment/comment.controller';
import { CommentModule } from './modules/comment/comment.module';
import { RepositoryController } from './modules/repository/repository.controller';
import { RepositoryModule } from './modules/repository/repository.module';
import { SuggestionController } from './modules/suggestion/suggestion.controller';
import { SuggestionModule } from './modules/suggestion/suggestion.module';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigSetupModule,
    CoreModule,
    UserModule,
    GithubModule,
    CommentModule,
    ClassificationModule,
    SuggestionModule,
    RepositoryModule,
    AnalyticsModule,
    JwtAuthModule,
  ],
  controllers: [
    UserController,
    GithubController,
    AnalyticsController,
    CommentController,
    ClassificationController,
    SuggestionController,
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
  ],
})
export class AppModule {}
