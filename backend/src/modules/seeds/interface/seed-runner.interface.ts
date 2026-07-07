import { EntityManager } from 'typeorm';
import { SeedResultDto } from '../dto/seed-result.dto';

export interface SeedRunner {
  run(manager: EntityManager): Promise<SeedResultDto>;
}
