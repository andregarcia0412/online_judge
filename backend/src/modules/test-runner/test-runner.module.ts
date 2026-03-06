import { Module } from '@nestjs/common';
import { TestRunnerService } from './test-runner.service';
import { CodeRunnerModule } from 'src/modules/code-runner/code-runner.module';

@Module({
  imports: [CodeRunnerModule],
  providers: [TestRunnerService],
  exports: [TestRunnerService],
})
export class TestRunnerModule {}
