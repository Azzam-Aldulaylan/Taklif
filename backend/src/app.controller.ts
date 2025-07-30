import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return {
      message: this.appService.getHello(),
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        docs: '/api/docs/examples',
        podcasts: '/api/podcasts',
        search: '/api/podcasts/search',
      },
      description: 'Thmanyah Podcast Search API - iTunes integration',
    };
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Thmanyah Backend',
      version: '1.0.0',
    };
  }
}
