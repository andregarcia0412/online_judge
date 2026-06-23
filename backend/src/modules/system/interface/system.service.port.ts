import { HealthDto } from '../dto/health.dto';
import { InfoDto } from '../dto/info.dto';

export interface SystemServicePort {
  health(): HealthDto;
  info(): InfoDto;
}

export const SystemServicePort = Symbol('SystemServicePort');
