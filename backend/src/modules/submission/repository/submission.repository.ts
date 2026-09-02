import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { Repository } from 'typeorm';
import { Submission } from '../entities/submission.entity';
import { SubmissionStatusEnum } from '../../../shared/enum/submission-status';
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
  ): Promise<Submission | null> {
    return await this.submissionRepository.findOne({
      where: {
        idUser,
        status: SubmissionStatusEnum.ACCEPTED,
        language,
        idProblem,
      },
    });
  }
  async findLastUserSubmission(idUser: string): Promise<Submission | null> {
    return await this.submissionRepository.findOne({
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
  ): Promise<Submission> {
    const createdSubmission = this.submissionRepository.create({
      ...submission,
      status: testResult.status,
      executionTime: testResult.executionTime,
      error: testResult.error,
      memoryUsageMB: testResult.memoryUsageMB,
      testCasesPassed: testResult.testCasesPassed,
    });
    return await this.submissionRepository.save(createdSubmission);
  }
  async findAll(): Promise<Submission[]> {
    return await this.submissionRepository.find();
  }
  async findOneById(id: string): Promise<Submission | null> {
    return await this.submissionRepository.findOneBy({ id });
  }
  async findAllByUserId(idUser: string): Promise<Submission[]> {
    return await this.submissionRepository.findBy({ idUser });
  }
  async updateById(
    id: string,
    updateSubmission: Partial<Submission>,
  ): Promise<Submission | null> {
    const submission = await this.submissionRepository.findOneBy({ id });

    if (!submission) {
      return null;
    }

    const merged = this.submissionRepository.merge(
      submission,
      updateSubmission,
    );
    return await this.submissionRepository.save(merged);
  }
  async remove(id: string): Promise<void> {
    await this.submissionRepository.delete(id);
  }

  private get submissionRepository(): Repository<Submission> {
    return this.txHost.tx.getRepository(Submission);
  }
}
