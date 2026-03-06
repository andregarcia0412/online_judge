import { Module } from '@nestjs/common';
import { CodeRunnerService } from './code-runner.service';

@Module({
  providers: [CodeRunnerService],
  exports: [CodeRunnerService],
})
export class CodeRunnerModule {}
