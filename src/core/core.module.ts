import { INestApplication, Module } from '@nestjs/common';
import { MongodbModule } from './database/mongodb.module';
import { setupSwagger } from './swagger/swagger.setup';

@Module({
  imports: [MongodbModule],
})
export class CoreModule {
  static configureSwagger(app: INestApplication): void {
    setupSwagger(app);
  }
}
