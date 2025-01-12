import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { CoreModule } from './core/core.module';

async function bootstrap() {
  // Create a new NestJS application instance using the AppModule
  const app = await NestFactory.create(AppModule);

  /**
   * Enable CORS with the following settings:
   *   - Allow any origin to access the application
   *   - Allow credentials (cookies, authentication headers) to be sent with requests
   *   - Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
   */
  const allowlist = [
    'http://localhost:3001',
    'https://peacemaker-front-end.fly.dev',
    'https://github.com',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowlist.includes(origin) ||
        origin.startsWith('chrome-extension://')
      ) {
        console.log('Allowing CORS request from:', origin);
        callback(null, true);
      } else {
        callback(new Error(`${origin} Not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.use(cookieParser());

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
