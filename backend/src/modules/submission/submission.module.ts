import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestRunnerModule } from 'src/modules/test-runner/test-runner.module';
import { ProblemModule } from '../problem/problem.module';
import { Submission } from './entities/submission.entity';
import { SubmissionRepositoryPort } from './interface/submission.repository.port';
import { SubmissionServicePort } from './interface/submission.service.port';
import { SubmissionRepository } from './repository/submission.repository';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { CreatePlaygroundSubmissionUseCase } from './use-case/create-playground.use-case';
import { CreateSubmissionUseCase } from './use-case/create.use-case';
import { DeleteSubmissionUseCase } from './use-case/delete.use-case';
import { FindAllSubmissionByUserIdUseCase } from './use-case/find-all-by-user-id.use-case';
import { FindAllSubmissionUseCase } from './use-case/find-all.use-case';
import { FindOneSubmissionByIdUseCase } from './use-case/find-one-by-id.use-case';
import { UpdateSubmissionUseCase } from './use-case/update.use-case';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission]),
    TestRunnerModule,
    ProblemModule,
    UserModule,
  ],
  controllers: [SubmissionController],
  providers: [
    { provide: SubmissionServicePort, useClass: SubmissionService },
    { provide: SubmissionRepositoryPort, useClass: SubmissionRepository },
    CreateSubmissionUseCase,
    CreatePlaygroundSubmissionUseCase,
    FindAllSubmissionUseCase,
    FindOneSubmissionByIdUseCase,
    FindAllSubmissionByUserIdUseCase,
    UpdateSubmissionUseCase,
    DeleteSubmissionUseCase,
  ],
  exports: [SubmissionServicePort],
})
export class SubmissionModule {}
