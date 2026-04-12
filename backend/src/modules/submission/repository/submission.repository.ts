import { Injectable } from '@nestjs/common';
import { SubmissionRepositoryPort } from '../interface/submission.repository.port';
import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { UpdateResult, DeleteResult, Repository } from 'typeorm';
import { CreateSubmissionDto } from '../dto/create-submission.dto';
import { Submission } from '../entities/submission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from '../enum/submission-status';
import { UpdateSubmissionDto } from '../dto/update-submission.dto';

@Injectable()
export class SubmissionRepository implements SubmissionRepositoryPort {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
  ) {}
  async findOneUserAcceptedSubmission(
    id_user: string,
    language: string,
    id_problem: number,
  ): Promise<Submission | null> {
    return await this.submissionRepository.findOne({
      where: {
        id_user,
        status: StatusEnum.ACCEPTED,
        language,
        id_problem,
      },
    });
  }
  async findLastUserSubmission(id_user: string): Promise<Submission | null> {
    return await this.submissionRepository.findOne({
      where: {
        id_user,
      },
      order: {
        submission_date: 'DESC',
      },
    });
  }
  async createAndSave(
    createSubmissionDto: CreateSubmissionDto,
    testResult: TestResult,
  ): Promise<Submission> {
    const createdSubmission = this.submissionRepository.create({
      ...createSubmissionDto,
      status: testResult.status,
      execution_time: testResult.execution_time,
      error: testResult.error,
      memory_usage_MB: testResult.memory_usage_MB,
      test_cases_passed: testResult.test_cases_passed,
    });
    return await this.submissionRepository.save(createdSubmission);
  }
  async findAll(): Promise<Submission[]> {
    return await this.submissionRepository.find();
  }
  async findOneById(id: string): Promise<Submission | null> {
    return await this.submissionRepository.findOneBy({ id });
  }
  async findAllByUserId(id_user: string): Promise<Submission[]> {
    return await this.submissionRepository.findBy({ id_user });
  }
  async updateById(
    id: string,
    updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<UpdateResult> {
    return await this.submissionRepository.update(id, updateSubmissionDto);
  }
  async delete(id: string): Promise<DeleteResult> {
    return await this.submissionRepository.delete(id);
  }
}
