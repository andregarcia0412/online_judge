import { Inject } from '@nestjs/common';
import { ProblemRepositoryPort } from 'src/modules/problem/interface/repository/problem.repository.port';
import { SeedResultDto } from '../dto/seed-result.dto';
import { SeedRunner } from '../interface/seed-runner.interface';
import { PROBLEM_SEED } from '../resource/problem.seed';
import { Transactional } from '@nestjs-cls/transactional';

export class ProblemSeedRunner implements SeedRunner {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
  ) {}

  @Transactional()
  async run(): Promise<SeedResultDto> {
    const result = new SeedResultDto();

    for (const seed of PROBLEM_SEED) {
      const exists = await this.problemRepository.findByTitle(seed.title);

      if (!exists) {
        await this.problemRepository.createAndSave(seed);
        result.created++;
      } else {
        result.skipped++;
      }
    }

    return result;
  }
}
