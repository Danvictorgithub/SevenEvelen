import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Role } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/authentication/auth/jwt.auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {
  }
  @Get()
  findAll() {
    return this.statsService.findAll();
  }
}
