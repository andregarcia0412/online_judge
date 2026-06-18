import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SubmissionRepositoryPort } from '../interface/submission.repository.port';
import { CreateSubmissionDto } from '../dto/create-submission.dto';
import { ReturnSubmissionDto } from '../dto/return-submission.dto';
import { StatusEnum } from '../enum/submission-status';
import { ProblemRepositoryPort } from 'src/modules/problem/interface/problem.repository.port';
import { TestCaseRepositoryPort } from 'src/modules/problem/interface/test-case.repository.port';
import { UserRepositoryPort } from 'src/modules/user/interface/user.repository.port';
import { DataSource, EntityManager } from 'typeorm';
import { Problem } from 'src/modules/problem/entities/problem.entity';
import { TestCase } from 'src/modules/problem/entities/test-case.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { TestRunnerService } from 'src/modules/test-runner/test-runner.service';

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
    private readonly testRunnerService: TestRunnerService,
    private readonly userService: UserService,
    private readonly datasource: DataSource,
  ) {}

  async execute(
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<ReturnSubmissionDto> {
    return await this.datasource.transaction(async (manager) => {
      const user = await this.getUserOrThrow(
        createSubmissionDto.id_user,
        manager,
      );

      const problem = await this.getProblemOrThrow(
        createSubmissionDto.id_problem,
        manager,
      );

      const testCases = await this.getTestCasesOrThrow(
        createSubmissionDto.id_problem,
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
          createSubmissionDto.id_problem,
          manager,
        );

      if (!submission && testResult.status == StatusEnum.ACCEPTED) {
        user.points = Number(user.points) + Number(problem.points);
        user.total_resolved = Number(user.total_resolved) + 1;
        problem.total_accepted = Number(problem.total_accepted) + 1;
      }

      problem.total_submitted = Number(problem.total_submitted) + 1;
      user.total_submissions = Number(user.total_submissions) + 1;

      await this.userService.updateUserStreakOnSubmission(user, manager);
      await this.userRepository.save(user, manager);
      await this.problemRepository.saveExistingEntity(problem, manager);

      const returnSubmissionDto = ReturnSubmissionDto.fromEntity(
        await this.submissionRepository.save(
          createSubmissionDto,
          testResult,
          manager,
        ),
      );
      returnSubmissionDto.last_stdout = testResult.stdout;

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
    id_problem: number,
    manager?: EntityManager,
  ): Promise<TestCase[]> {
    const testCases = await this.testCaseRepository.findByProblemId(
      id_problem,
      manager,
    );

    if (!testCases || testCases.length === 0) {
      throw new NotFoundException('There are no test cases for this problem');
    }

    return testCases;
  }
}
