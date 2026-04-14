import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TestRunnerService } from 'src/modules/test-runner/test-runner.service';
import { User } from 'src/modules/user/entities/user.entity';
import { DeleteResult, EntityManager, UpdateResult } from 'typeorm';
import { Problem } from '../problem/entities/problem.entity';
import { TestCase } from '../problem/entities/test-case.entity';
import { ProblemRepositoryPort } from '../problem/interface/problem.repository.port';
import { TestCaseRepositoryPort } from '../problem/interface/test-case.repository.port';
import { TestResult } from '../test-runner/dto/test-result.dto';
import { UserRepositoryPort } from '../user/interface/user.repository.port';
import { UserService } from '../user/user.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReturnSubmissionDto } from './dto/return-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Submission } from './entities/submission.entity';
import { StatusEnum } from './enum/submission-status';
import { SubmissionRepositoryPort } from './interface/submission.repository.port';
import { DataSource } from 'typeorm';

@Injectable()
export class SubmissionService {
  constructor(
    @Inject(SubmissionRepositoryPort)
    private submissionRepository: SubmissionRepositoryPort,
    @Inject(UserRepositoryPort)
    private userRepository: UserRepositoryPort,
    @Inject(ProblemRepositoryPort)
    private problemRepository: ProblemRepositoryPort,
    @Inject(TestCaseRepositoryPort)
    private testCaseRepository: TestCaseRepositoryPort,
    private testRunnerService: TestRunnerService,
    private userService: UserService,
    private readonly datasource: DataSource,
  ) {}

  async create(
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
        await this.submissionRepository.createAndSave(
          createSubmissionDto,
          testResult,
          manager,
        ),
      );
      returnSubmissionDto.last_stdout = testResult.stdout;

      return returnSubmissionDto;
    });
  }

  async createPlaygroundSubmission(
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<TestResult> {
    await this.getProblemOrThrow(createSubmissionDto.id_problem);

    const testCases = await this.getTestCasesOrThrow(
      createSubmissionDto.id_problem,
    );

    const testResults = await this.testRunnerService.runTests(
      testCases,
      createSubmissionDto.text,
      createSubmissionDto.language,
    );

    return testResults;
  }

  async findAll() {
    return (await this.submissionRepository.findAll()).map(
      (submission: Submission) => ReturnSubmissionDto.fromEntity(submission),
    );
  }

  async findOneById(id: string): Promise<ReturnSubmissionDto> {
    const savedSubmission = await this.submissionRepository.findOneById(id);
    if (!savedSubmission) {
      throw new NotFoundException('Submission not found');
    }
    return ReturnSubmissionDto.fromEntity(savedSubmission);
  }

  async findAllByUserId(id_user: string): Promise<ReturnSubmissionDto[]> {
    return (await this.submissionRepository.findAllByUserId(id_user)).map(
      (submission) => ReturnSubmissionDto.fromEntity(submission),
    );
  }

  async update(
    id: string,
    updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<UpdateResult> {
    return await this.submissionRepository.updateById(id, updateSubmissionDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.submissionRepository.delete(id);
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
