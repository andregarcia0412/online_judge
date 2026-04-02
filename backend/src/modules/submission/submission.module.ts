import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeRunnerModule } from 'src/modules/code-runner/code-runner.module';
import { TestRunnerModule } from 'src/modules/test-runner/test-runner.module';
import { Problem } from '../problem/entities/problem.entity';
import { TestCase } from '../test-case/entities/test-case.entity';
import { User } from '../user/entities/user.entity';
import { Submission } from './entities/submission.entity';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, User, Problem, TestCase]),
    CodeRunnerModule,
    TestRunnerModule,
    UserModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
