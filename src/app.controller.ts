import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/tags')
  async findAllTags() {
    const tags = await this.appService.findAllTags();
    return { tags };
  }
}
