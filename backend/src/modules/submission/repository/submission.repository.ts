import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { EntityManager, Repository } from 'typeorm';
import { Submission } from '../entities/submission.entity';
import { StatusEnum } from '../enum/submission-status';
import { SubmissionRepositoryPort } from '../interface/submission.repository.port';

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
  async save(
    submission: Partial<Submission>,
    testResult: TestResult,
    manager?: EntityManager,
  ): Promise<Submission> {
    const repository = this.getRepository(manager);
    const createdSubmission = repository.create({
      ...submission,
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
    updateSubmission: Partial<Submission>,
    manager?: EntityManager,
  ): Promise<Submission | null> {
    const repository = this.getRepository(manager);
    const submission = await repository.findOneBy({ id });

    if (!submission) {
      return null;
    }

    const merged = repository.merge(submission, updateSubmission);
    return await repository.save(merged);
  }
  async remove(id: string, manager?: EntityManager): Promise<void> {
    const repository = this.getRepository(manager);
    await repository.delete(id);
  }

  private getRepository(manager?: EntityManager): Repository<Submission> {
    return manager
      ? manager.getRepository(Submission)
      : this.submissionRepository;
  }
}
