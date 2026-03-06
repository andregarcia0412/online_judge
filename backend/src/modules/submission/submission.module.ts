import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeRunnerModule } from 'src/modules/code-runner/code-runner.module';
import { ProblemModule } from 'src/modules/problem/problem.module';
import { TestCaseModule } from 'src/modules/test-case/test-case.module';
import { TestRunnerModule } from 'src/modules/test-runner/test-runner.module';
import { User } from '../user/entities/user.entity';
import { Submission } from './entities/submission.entity';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, User]),
    ProblemModule,
    TestCaseModule,
    CodeRunnerModule,
    TestRunnerModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
