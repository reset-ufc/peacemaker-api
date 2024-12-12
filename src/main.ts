import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        'http://127.0.0.1:5500',
        'http://localhost:5173',
        'http://localhost:3000',
        'https://github.com',
        'chrome-extension://ldogapjphnaepacaglhfaeljngppmcmh',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    }
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Peacemaker API')
    .setDescription('Moderation GithubBot API')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(process.env.PORT! ?? 3000);
}
bootstrap();
