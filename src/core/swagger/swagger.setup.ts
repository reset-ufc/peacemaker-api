import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  /**
   * Configure Swagger documentation
   * https://docs.nestjs.com/openapi/introduction
   *
   */
  const config = new DocumentBuilder()
    .setTitle('Peacemaker API')
    .setDescription('Moderation GithubBot API')
    .setVersion('0.0.1')
    .addCookieAuth('access_token');

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config.build());

  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'docs/openapi.json',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
