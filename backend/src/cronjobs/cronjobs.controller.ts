import { Controller, Get } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';

@Controller('cronjobs')
export class CronjobsController {
  constructor(private readonly cronjobsService: CronjobsService) {
  }
  @Get('deliverReorders')
  deliverReorder() {
    return this.cronjobsService.deliverReorder();
  }
  @Get('reorderNewProducts')
  reorderNewProducts() {
    return this.cronjobsService.reorderNewProducts();
  }
}
