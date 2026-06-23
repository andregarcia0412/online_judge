import { Controller, Get, Inject } from '@nestjs/common';
import { HealthDto } from './dto/health.dto';
import { InfoDto } from './dto/info.dto';
import { SystemServicePort } from './interface/system.service.port';

@Controller()
export class SystemController {
  constructor(
    @Inject(SystemServicePort)
    private readonly systemService: SystemServicePort,
  ) {}
  @Get('health')
  health(): HealthDto {
    return this.systemService.health();
  }

  @Get('info')
  info(): InfoDto {
    return this.systemService.info();
  }
}
