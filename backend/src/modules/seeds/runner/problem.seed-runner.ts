import { EntityManager } from 'typeorm';
import { SeedResultDto } from '../dto/seed-result.dto';
import { SeedRunner } from '../interface/seed-runner.interface';
import { PROBLEM_SEED } from '../resource/problem.seed';
import { Inject } from '@nestjs/common';
import { ProblemRepositoryPort } from 'src/modules/problem/interface/repository/problem.repository.port';

export class ProblemSeedRunner implements SeedRunner {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
  ) {}

  async run(manager: EntityManager): Promise<SeedResultDto> {
    const result = new SeedResultDto();

    for (const seed of PROBLEM_SEED) {
      const exists = await this.problemRepository.findByTitle(
        seed.title,
        manager,
      );

      if (!exists) {
        await this.problemRepository.createAndSave(seed, manager);
        result.created++;
      } else {
        result.skipped++;
      }
    }

    return result;
  }
}
