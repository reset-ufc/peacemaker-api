import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: '*',
      credentials: true,
      maxAge: 3600, // 1 hour
    },
  });

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Peacemaker API')
    .setDescription('Moderation GithubBot API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  const port = configService.get<number>('server.port') as number;

  await app.listen(port);
}

bootstrap();
