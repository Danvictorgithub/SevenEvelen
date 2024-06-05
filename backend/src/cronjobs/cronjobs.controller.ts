import { Controller, Get, UseGuards } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { JwtAuthGuard } from 'src/authentication/auth/jwt.auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Role, Roles } from 'src/enums/roles.enum';

@Controller('cronjobs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
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
