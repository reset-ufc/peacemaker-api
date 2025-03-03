import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export function setupSwagger(app: INestApplication): void {
  /**
   * Configure Swagger documentation
   * https://docs.nestjs.com/openapi/introduction
   *
   */
  const config = new DocumentBuilder()
    .setTitle('Peacemaker API')
    .setDescription('Moderation GithubBot API')
    .setVersion('1.0')
    .addBearerAuth();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config.build());

  // Define Swagger documentation endpoint
  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerUiEnabled: false,
    jsonDocumentUrl: 'docs/openapi.json',
  });

  app.use(
    '/reference',
    apiReference({
      theme: 'purple',
      spec: {
        url: 'docs/openapi.json',
      },
    }),
  );
}
