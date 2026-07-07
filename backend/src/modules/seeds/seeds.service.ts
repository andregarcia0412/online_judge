import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProblemSeedRunner } from './runner/problem.seed-runner';
import { SeedRunner } from './interface/seed-runner.interface';

@Injectable()
export class SeedsService {
  private readonly logger = new Logger(SeedsService.name);
  constructor(
    private readonly dataSource: DataSource,
    private readonly problemSeed: ProblemSeedRunner,
  ) {}

  async onModuleInit() {
    this.logger.log('Applying seeds...');

    await this.runSeed('Problem', this.problemSeed);

    this.logger.log('Seeds finished');
  }

  private async runSeed(name: string, seed: SeedRunner) {
    try {
      const result = await this.dataSource.transaction(
        async (manager) => await seed.run(manager),
      );
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
