import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Problem } from 'src/modules/problem/entities/problem.entity';
import { TestCase } from 'src/modules/problem/entities/test-case.entity';
import { ProblemServicePort } from 'src/modules/problem/interface/service/problem.service.port';
import { TestCaseServicePort } from 'src/modules/problem/interface/service/test-case.service.port';
import { TestRunnerServicePort } from 'src/modules/test-runner/interface/test-runner.service.port';
import { User } from 'src/modules/user/entities/user.entity';
import { UserServicePort } from 'src/modules/user/interface/user.service.port';
import { CreateSubmissionDto } from '../dto/create-submission.dto';
import { ReturnSubmissionDto } from '../dto/return-submission.dto';
import { StatusEnum } from '../enum/submission-status';
import { SubmissionRepositoryPort } from '../interface/submission.repository.port';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

@Injectable()
export class CreateSubmissionUseCase {
  constructor(
    @Inject(SubmissionRepositoryPort)
    private readonly submissionRepository: SubmissionRepositoryPort,
    @Inject(ProblemServicePort)
    private readonly problemService: ProblemServicePort,
    @Inject(TestCaseServicePort)
    private readonly testCaseService: TestCaseServicePort,
    @Inject(TestRunnerServicePort)
    private readonly testRunnerService: TestRunnerServicePort,
    @Inject(UserServicePort)
    private readonly userService: UserServicePort,
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}

  async execute(
    idUser: string,
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<ReturnSubmissionDto> {
    const user = await this.getUserOrThrow(idUser);

    const problem = await this.getProblemOrThrow(createSubmissionDto.idProblem);

    const testCases = await this.getTestCasesOrThrow(
      createSubmissionDto.idProblem,
    );

    const testResult = await this.testRunnerService.runTests(
      testCases,
      createSubmissionDto.text,
      createSubmissionDto.language,
    );

    const submission =
      await this.submissionRepository.findOneUserAcceptedSubmission(
        user.id,
        createSubmissionDto.language,
        createSubmissionDto.idProblem,
      );

    if (testResult.status === StatusEnum.ACCEPTED) {
      problem.totalAccepted = Number(problem.totalAccepted) + 1;
      if (!submission) {
        user.points = Number(user.points) + Number(problem.points);
        user.totalResolved = Number(user.totalResolved) + 1;
      }
    }

    problem.totalSubmitted = Number(problem.totalSubmitted) + 1;
    user.totalSubmissions = Number(user.totalSubmissions) + 1;

    return await this.txHost.withTransaction(async () => {
      this.userService.updateUserStreakOnSubmission(user);
      user.lastSubmissionDate = new Date();
      await this.userService.update(user.id, user);
      await this.problemService.update(problem.id, problem);

      const returnSubmissionDto = ReturnSubmissionDto.fromEntity(
        await this.submissionRepository.save(
          { ...createSubmissionDto, idUser: user.id },
          testResult,
        ),
      );
      returnSubmissionDto.lastStdout = testResult.stdout;

      return returnSubmissionDto;
    });
  }

  private async getUserOrThrow(id: string): Promise<User> {
    return await this.userService.findUserEntityById(id);
  }

  private async getProblemOrThrow(id: number): Promise<Problem> {
    return await this.problemService.findProblemEntityById(id);
  }

  private async getTestCasesOrThrow(idProblem: number): Promise<TestCase[]> {
    const testCases =
      await this.testCaseService.findAllEntitiesByProblemId(idProblem);

    if (!testCases || testCases.length === 0) {
      throw new NotFoundException('There are no test cases for this problem');
    }

    return testCases;
  }
}
