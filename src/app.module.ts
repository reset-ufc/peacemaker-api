import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ConfigSetupModule } from './config/configure.module';
import { CoreModule } from './core/core.module';
import { JwtAuthStrategy } from './modules/auth/jwt/jwt-auth.strategy';
import { GithubController } from './modules/auth/oauth/github/github.controller';
import { GithubModule } from './modules/auth/oauth/github/github.module';
import { CommentsController } from './modules/comments/comments.controller';
import { CommentsModule } from './modules/comments/comments.module';
import { DashboardController } from './modules/dashboard/dashboard.controller';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { RepositoriesController } from './modules/repositories/repositories.controller';
import { RepositoriesModule } from './modules/repositories/repositories.module';
import { SuggestionsController } from './modules/suggestions/suggestions.controller';
import { SuggestionsModule } from './modules/suggestions/suggestions.module';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigSetupModule,
    CoreModule,
    UsersModule,
    RepositoriesModule,
    CommentsModule,
    SuggestionsModule,
    GithubModule,
    DashboardModule
  ],
  controllers: [
    GithubController,
    UsersController,
    RepositoriesController,
    CommentsController,
    SuggestionsController,
    DashboardController
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
