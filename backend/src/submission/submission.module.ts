import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { ProblemModule } from 'src/problem/problem.module';
import { TestCaseModule } from 'src/test-case/test-case.module';
import { CodeRunnerModule } from 'src/code-runner/code-runner.module';
import { TestRunnerModule } from 'src/test-runner/test-runner.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission]),
    UserModule,
    ProblemModule,
    TestCaseModule,
    CodeRunnerModule,
    TestRunnerModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
