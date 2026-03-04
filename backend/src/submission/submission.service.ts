import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { ProblemService } from 'src/problem/problem.service';
import { TestCaseService } from 'src/test-case/test-case.service';
import { TestRunnerService } from 'src/test-runner/test-runner.service';
import { ReturnSubmissionDto } from './dto/return-submission.dto';
import { UpdateResult } from 'typeorm/browser';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,

    private userService: UserService,
    private problemService: ProblemService,
    private testCaseService: TestCaseService,
    private testRunnerService: TestRunnerService,
  ) {}

  async create(
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<ReturnSubmissionDto> {
    if (!(await this.userService.findOneById(createSubmissionDto.id_user))) {
      throw new NotFoundException('User not found');
    }

    const problem = await this.problemService.findOneById(
      createSubmissionDto.id_problem,
    );

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    const testCases = await this.testCaseService.findAllByProblemId(
      createSubmissionDto.id_problem,
    );

    if (!testCases) {
      throw new NotFoundException('There are no test cases for this problem');
    }

    const testResult = await this.testRunnerService.runTests(
      testCases,
      createSubmissionDto.text,
      createSubmissionDto.language,
    );
    const newSubmission = this.submissionRepository.create({
      ...createSubmissionDto,
      status: testResult.status,
      execution_time: testResult.execution_time,
      error: testResult.error,
    });

    return ReturnSubmissionDto.fromEntity(
      await this.submissionRepository.save(newSubmission),
    );
  }

  findAll() {
    return this.submissionRepository.find();
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
