import { ConfigSetupModule } from './config/configure.module';
import { CoreModule } from './core/core.module';

import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtAuthModule } from './modules/auth/jwt/jwt-auth.module';
import { JwtAuthStrategy } from './modules/auth/jwt/jwt-auth.strategy';
import { GithubController } from './modules/auth/oauth/github/github.controller';
import { GithubModule } from './modules/auth/oauth/github/github.module';
import { CommentsController } from './modules/comments/comments.controller';
import { CommentsModule } from './modules/comments/comments.module';
import { FeedbacksController } from './modules/feedbacks/feedbacks.controller';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { RepositoriesController } from './modules/repositories/repositories.controller';
import { RepositoriesModule } from './modules/repositories/repositories.module';
import { SuggestionsController } from './modules/suggestions/suggestions.controller';
import { SuggestionsModule } from './modules/suggestions/suggestions.module';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigSetupModule,
    JwtAuthModule,
    GithubModule,
    CoreModule,
    RepositoriesModule,
    CommentsModule,
    SuggestionsModule,
    FeedbacksModule,
    MetricsModule,
    UsersModule,
  ],
  controllers: [
    GithubController,
    UsersController,
    RepositoriesController,
    CommentsController,
    SuggestionsController,
    FeedbacksController,
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
