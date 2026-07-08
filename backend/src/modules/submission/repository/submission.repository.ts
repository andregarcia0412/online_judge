import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { EntityManager, Repository } from 'typeorm';
import { Submission } from '../entities/submission.entity';
import { SubmissionStatusEnum } from '../enum/submission-status';
import { SubmissionRepositoryPort } from '../interface/submission.repository.port';

@Injectable()
export class SubmissionRepository implements SubmissionRepositoryPort {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}
  async findOneUserAcceptedSubmission(
    idUser: string,
    language: string,
    idProblem: number,
    manager?: EntityManager,
  ): Promise<Submission | null> {
    const repository = this.getRepository(manager);
    return await repository.findOne({
      where: {
        idUser,
        status: SubmissionStatusEnum.ACCEPTED,
        language,
        idProblem,
      },
    });
  }
  async findLastUserSubmission(
    idUser: string,
    manager?: EntityManager,
  ): Promise<Submission | null> {
    const repository = this.getRepository(manager);
    return await repository.findOne({
      where: {
        idUser,
      },
      order: {
        submissionDate: 'DESC',
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
      executionTime: testResult.executionTime,
      error: testResult.error,
      memoryUsageMB: testResult.memoryUsageMB,
      testCasesPassed: testResult.testCasesPassed,
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
    idUser: string,
    manager?: EntityManager,
  ): Promise<Submission[]> {
    const repository = this.getRepository(manager);
    return await repository.findBy({ idUser });
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
    return (manager ?? this.txHost.tx).getRepository(Submission);
  }
}
