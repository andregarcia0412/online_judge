import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestRunnerService } from 'src/modules/test-runner/test-runner.service';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { DeleteResult, UpdateResult } from 'typeorm/browser';
import { Problem } from '../problem/entities/problem.entity';
import { TestCase } from '../test-case/entities/test-case.entity';
import { TestResult } from '../test-runner/dto/test-result.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReturnSubmissionDto } from './dto/return-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Submission } from './entities/submission.entity';
import { StatusEnum } from './enum/submission-status';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Problem)
    private problemRepository: Repository<Problem>,
    @InjectRepository(TestCase)
    private testCaseRepository: Repository<TestCase>,
    private testRunnerService: TestRunnerService,
  ) {}

  async create(
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<ReturnSubmissionDto> {
    const user = await this.userRepository.findOneBy({
      id: createSubmissionDto.id_user,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const problem = await this.problemRepository.findOneBy({
      id: createSubmissionDto.id_problem,
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    const testCases = await this.testCaseRepository.findBy({
      id_problem: createSubmissionDto.id_problem,
    });

    if (!testCases || testCases.length === 0) {
      throw new NotFoundException('There are no test cases for this problem');
    }

    const testResult = await this.testRunnerService.runTests(
      testCases,
      createSubmissionDto.text,
      createSubmissionDto.language,
    );

    const submission = await this.submissionRepository.findOne({
      where: {
        id_user: user.id,
        status: StatusEnum.ACCEPTED,
        language: createSubmissionDto.language,
      },
    });

    if (!submission && testResult.status == StatusEnum.ACCEPTED) {
      user.points = Number(user.points) + Number(problem.points);
    }

    this.userRepository.save(user);

    const newSubmission = this.submissionRepository.create({
      ...createSubmissionDto,
      status: testResult.status,
      execution_time: testResult.execution_time,
      error: testResult.error,
      memory_usage_MB: testResult.memory_usage_MB,
      test_cases_passed: testResult.test_cases_passed,
    });

    const returnSubmissionDto = ReturnSubmissionDto.fromEntity(
      await this.submissionRepository.save(newSubmission),
    );
    returnSubmissionDto.last_stdout = testResult.stdout;

    return returnSubmissionDto;
  }

  async createPlaygroundSubmission(
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<TestResult> {
    const problem = await this.problemRepository.findOneBy({
      id: createSubmissionDto.id_problem,
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    const testCases = await this.testCaseRepository.findBy({
      id_problem: createSubmissionDto.id_problem,
    });

    if (!testCases || testCases.length === 0) {
      throw new NotFoundException('There are no test cases for this problem');
    }

    const testResults = await this.testRunnerService.runTests(
      testCases,
      createSubmissionDto.text,
      createSubmissionDto.language,
    );

    return testResults;
  }

  async findAll() {
    return (await this.submissionRepository.find()).map(
      (submission: Submission) => ReturnSubmissionDto.fromEntity(submission),
    );
  }

  async findOneById(id: string): Promise<ReturnSubmissionDto> {
    const savedSubmission = await this.submissionRepository.findOneBy({ id });
    if (!savedSubmission) {
      throw new NotFoundException('Submission not found');
    }
    return ReturnSubmissionDto.fromEntity(savedSubmission);
  }

  async findAllByUserId(id_user: string): Promise<ReturnSubmissionDto[]> {
    return (await this.submissionRepository.findBy({ id_user })).map(
      (submission) => ReturnSubmissionDto.fromEntity(submission),
    );
  }

  async update(
    id: string,
    updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<UpdateResult> {
    return await this.submissionRepository.update(id, updateSubmissionDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.submissionRepository.delete(id);
  }
}
