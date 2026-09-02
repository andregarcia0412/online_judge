import { Transactional } from '@nestjs-cls/transactional';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { SeedRunner } from './interface/seed-runner.interface';
import { ProblemSeedRunner } from './runner/problem.seed-runner';

@Injectable()
export class SeedsService {
  private readonly logger = new Logger(SeedsService.name);
  private readonly runSeeds: boolean;
  constructor(
    private readonly problemSeed: ProblemSeedRunner,
    private readonly configService: ConfigService,
  ) {
    this.runSeeds = configService.getOrThrow<boolean>('RUN_SEEDS');
  }

  async onModuleInit() {
    if (this.runSeeds) {
      this.logger.log('Applying seeds...');

      await this.runSeed('Problem', this.problemSeed);

      this.logger.log('Seeds finished');
    }
  }

  @Transactional()
  private async runSeed(name: string, seed: SeedRunner) {
    try {
      const result = await seed.run();
      this.logger.log(
        `Seed ${name} applied successfuly (${result.created}) entities created - ${result.skipped} entities skipped`,
      );
    } catch (e) {
      this.logger.error(
        `Error while applying seed ${name}`,
        e instanceof Error ? e.stack : e,
      );
    }
  }
}
