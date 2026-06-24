import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Problem } from 'src/modules/problem/entities/problem.entity';
import { TestCase } from 'src/modules/problem/entities/test-case.entity';
import { ProblemRepositoryPort } from 'src/modules/problem/interface/repository/problem.repository.port';
import { TestCaseRepositoryPort } from 'src/modules/problem/interface/repository/test-case.repository.port';
import { TestRunnerServicePort } from 'src/modules/test-runner/interface/test-runner.service.port';
import { User } from 'src/modules/user/entities/user.entity';
import { UserRepositoryPort } from 'src/modules/user/interface/user.repository.port';
import { UserServicePort } from 'src/modules/user/interface/user.service.port';
import { DataSource, EntityManager } from 'typeorm';
import { CreateSubmissionDto } from '../dto/create-submission.dto';
import { ReturnSubmissionDto } from '../dto/return-submission.dto';
import { StatusEnum } from '../enum/submission-status';
import { SubmissionRepositoryPort } from '../interface/submission.repository.port';

@Injectable()
export class CreateSubmissionUseCase {
  constructor(
    @Inject(SubmissionRepositoryPort)
    private readonly submissionRepository: SubmissionRepositoryPort,
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
    @Inject(TestRunnerServicePort)
    private readonly testRunnerService: TestRunnerServicePort,
    @Inject(UserServicePort)
    private readonly userService: UserServicePort,
    private readonly datasource: DataSource,
  ) {}

  async execute(
    idUser: string,
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<ReturnSubmissionDto> {
    return await this.datasource.transaction(async (manager) => {
      const user = await this.getUserOrThrow(idUser, manager);

      const problem = await this.getProblemOrThrow(
        createSubmissionDto.idProblem,
        manager,
      );

      const testCases = await this.getTestCasesOrThrow(
        createSubmissionDto.idProblem,
        manager,
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
          manager,
        );

      if (!submission && testResult.status == StatusEnum.ACCEPTED) {
        user.points = Number(user.points) + Number(problem.points);
        user.totalResolved = Number(user.totalResolved) + 1;
        problem.totalAccepted = Number(problem.totalAccepted) + 1;
      }

      problem.totalSubmitted = Number(problem.totalSubmitted) + 1;
      user.totalSubmissions = Number(user.totalSubmissions) + 1;

      await this.userService.updateUserStreakOnSubmission(user, manager);
      await this.userRepository.save(user, manager);
      await this.problemRepository.saveExistingEntity(problem, manager);

      const returnSubmissionDto = ReturnSubmissionDto.fromEntity(
        await this.submissionRepository.save(
          { ...createSubmissionDto, idUser: user.id },
          testResult,
          manager,
        ),
      );
      returnSubmissionDto.lastStdout = testResult.stdout;

      return returnSubmissionDto;
    });
  }

  private async getUserOrThrow(
    id: string,
    manager?: EntityManager,
  ): Promise<User> {
    const user = await this.userRepository.findOneById(id, manager);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async getProblemOrThrow(
    id: number,
    manager?: EntityManager,
  ): Promise<Problem> {
    const problem = await this.problemRepository.findById(id, manager);
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return problem;
  }

  private async getTestCasesOrThrow(
    idProblem: number,
    manager?: EntityManager,
  ): Promise<TestCase[]> {
    const testCases = await this.testCaseRepository.findByProblemId(
      idProblem,
      manager,
    );

    if (!testCases || testCases.length === 0) {
      throw new NotFoundException('There are no test cases for this problem');
    }

    return testCases;
  }
}
