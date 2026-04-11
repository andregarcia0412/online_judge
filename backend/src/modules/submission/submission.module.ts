import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeRunnerModule } from 'src/modules/code-runner/code-runner.module';
import { TestRunnerModule } from 'src/modules/test-runner/test-runner.module';
import { ProblemModule } from '../problem/problem.module';
import { UserModule } from '../user/user.module';
import { Submission } from './entities/submission.entity';
import { SubmissionRepositoryPort } from './interface/submission.repository.port';
import { SubmissionRepository } from './repository/submission.repository';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission]),
    CodeRunnerModule,
    TestRunnerModule,
    forwardRef(() => UserModule),
    ProblemModule,
  ],
  controllers: [SubmissionController],
  providers: [
    SubmissionService,
    { provide: SubmissionRepositoryPort, useClass: SubmissionRepository },
  ],
  exports: [SubmissionService, SubmissionRepositoryPort],
})
export class SubmissionModule {}
