import { Injectable } from '@nestjs/common';
import { HealthDto } from './dto/health.dto';
import { InfoDto } from './dto/info.dto';
import { SystemServicePort } from './interface/system.service.port';

@Injectable()
export class SystemService implements SystemServicePort {
  health(): HealthDto {
    return new HealthDto('ok', process.uptime(), new Date());
  }

  info(): InfoDto {
    return new InfoDto('Online Judge API', '1.0.0');
  }
}
