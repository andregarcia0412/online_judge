import { Controller, Get } from '@nestjs/common';
import { SystemService } from './system.service';
import { HealthDto } from './dto/health.dto';
import { InfoDto } from './dto/info.dto';

@Controller()
export class SystemController {
  constructor(private readonly systemService: SystemService) {}
  @Get('health')
  health(): HealthDto {
    return this.systemService.health();
  }

  @Get('info')
  info(): InfoDto {
    return this.systemService.info();
  }
}
