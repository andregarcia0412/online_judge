import { Injectable } from '@nestjs/common';
import { SubmissionRepositoryPort } from '../interface/submission.repository.port';
import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { UpdateResult, DeleteResult, Repository, EntityManager } from 'typeorm';
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
    manager?: EntityManager,
  ): Promise<Submission | null> {
    const repository = this.getRepository(manager);
    return await repository.findOne({
      where: {
        id_user,
        status: StatusEnum.ACCEPTED,
        language,
        id_problem,
      },
    });
  }
  async findLastUserSubmission(
    id_user: string,
    manager?: EntityManager,
  ): Promise<Submission | null> {
    const repository = this.getRepository(manager);
    return await repository.findOne({
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
    manager?: EntityManager,
  ): Promise<Submission> {
    const repository = this.getRepository(manager);
    const createdSubmission = repository.create({
      ...createSubmissionDto,
      status: testResult.status,
      execution_time: testResult.execution_time,
      error: testResult.error,
      memory_usage_MB: testResult.memory_usage_MB,
      test_cases_passed: testResult.test_cases_passed,
    });
    return await repository.save(createdSubmission);
  }
  async findAll(manager?: EntityManager): Promise<Submission[]> {
    const repository = this.getRepository(manager);
    return await repository.find();
  }
  async findOneById(
    id: string,
    manager?: EntityManager,
  ): Promise<Submission | null> {
    const repository = this.getRepository(manager);
    return await repository.findOneBy({ id });
  }
  async findAllByUserId(
    id_user: string,
    manager?: EntityManager,
  ): Promise<Submission[]> {
    const repository = this.getRepository(manager);
    return await repository.findBy({ id_user });
  }
  async updateById(
    id: string,
    updateSubmissionDto: UpdateSubmissionDto,
    manager?: EntityManager,
  ): Promise<UpdateResult> {
    const repository = this.getRepository(manager);
    return await repository.update(id, updateSubmissionDto);
  }
  async delete(id: string, manager?: EntityManager): Promise<DeleteResult> {
    const repository = this.getRepository(manager);
    return await repository.delete(id);
  }

  private getRepository(manager?: EntityManager): Repository<Submission> {
    return manager
      ? manager.getRepository(Submission)
      : this.submissionRepository;
  }
}
