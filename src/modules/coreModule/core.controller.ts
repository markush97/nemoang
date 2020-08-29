import { Controller, Get } from '@nestjs/common';

@Controller()
export class CoreController {
  constructor() {}

  @Get()
  async root() {}
}
