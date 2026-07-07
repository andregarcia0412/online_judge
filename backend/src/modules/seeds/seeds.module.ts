import { Module } from '@nestjs/common';
import { ProblemModule } from '../problem/problem.module';
import { SeedsService } from './seeds.service';
import { ProblemSeedRunner } from './runner/problem.seed-runner';

@Module({
  imports: [ProblemModule],
  providers: [SeedsService, ProblemSeedRunner],
})
export class SeedsModule {}
