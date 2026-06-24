import { Controller, Get, Inject } from '@nestjs/common';
import { HealthDto } from './dto/health.dto';
import { InfoDto } from './dto/info.dto';
import { SystemServicePort } from './interface/system.service.port';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class SystemController {
  constructor(
    @Inject(SystemServicePort)
    private readonly systemService: SystemServicePort,
  ) {}
  @Get('health')
  @ApiOkResponse({ type: HealthDto })
  health(): HealthDto {
    return this.systemService.health();
  }

  @Get('info')
  @ApiOkResponse({ type: InfoDto })
  info(): InfoDto {
    return this.systemService.info();
  }
}
