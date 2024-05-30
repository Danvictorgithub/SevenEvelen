import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Role } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';

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
