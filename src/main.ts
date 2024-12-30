import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CoreModule } from './core/core.module';

async function bootstrap() {
  /**
   * Create a new NestJS application instance using the AppModule
   * Enable CORS with the following settings:
   *   - Allow any origin to access the application
   *   - Allow credentials (cookies, authentication headers) to be sent with requests
   *   - Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
   */
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      credentials: true,
      methods: '*',
    },
  });

  // Use a global validation pipe to automatically validate incoming requests
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  // Configure Swagger
  CoreModule.configureSwagger(app);

  // Get the ConfigService instance to access configuration variables
  const configService = app.get(ConfigService);

  // Start the application and listen on the port specified in the configuration
  await app.listen(configService.get<number>('server.port') as number);
}

bootstrap();
