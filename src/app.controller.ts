import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  version() {
    const { version, description } = this.appService.getVersion();

    return { version, description };
  }
}
