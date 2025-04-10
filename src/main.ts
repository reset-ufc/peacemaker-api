import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { CoreModule } from './core/core.module';

dotenv.config();

async function bootstrap() {
  // Create a new NestJS application instance using the AppModule
  const app = await NestFactory.create(AppModule);

  /**
   * Enable CORS with the following settings:
   *   - Allow any origin to access the application (e.g. http://localhost:3000)
   *   - Allow credentials (cookies, authentication headers) to be sent with requests
   *   - Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
   */
  // const allowedOrigins = [
  //   'http://localhost:3001',
  //   'http://localhost:3000',
  //   'https://peacemaker-front-end.fly.dev',
  //   'https://github.com',
  // ];

  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    //todo: refactor to use CorsOptions
    // origin: (origin, callback) => {
    //   // allow requests with no origin (like mobile apps or curl requests)
    //   if (!origin || origin.startsWith('chrome-extension://')) {
    //     console.log('Allowing CORS request from:', origin);
    //     return callback(null, true);
    //   }
    //   // Check origin for not allowed
    //   if (!allowedOrigins.includes(origin)) {
    //     console.error(
    //       `The Origin header '${origin}' used in the request does not match the list of allowed origins.`,
    //       'CorsConfigService',
    //     );
    //   }

    //   return callback(new ForbiddenException(), false);
    // },

    origin: true,
    credentials: true,

    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  } as CorsOptions);

  app.use(cookieParser());

  // Use a global validation pipe to automatically validate incoming requests
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  // Configure Swagger
  CoreModule.configureSwagger(app);

  // Get the ConfigService instance to access configuration variables
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('server.port');

  // Start the application and listen on the port specified in the configuration
  console.log(`Server is running on port ${PORT}`);
  await app.listen(PORT as number);
}

bootstrap();
