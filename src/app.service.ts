import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getVersion(): { version: string; description: string } {
    return {
      version: '1.0.0',
      description: 'API for the Peacemaker project',
    };
  }
}
