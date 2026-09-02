import { SeedResultDto } from '../dto/seed-result.dto';

export interface SeedRunner {
  run(): Promise<SeedResultDto>;
}
