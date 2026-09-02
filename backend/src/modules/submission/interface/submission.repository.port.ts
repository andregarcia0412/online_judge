import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { Submission } from '../entities/submission.entity';

export interface SubmissionRepositoryPort {
  findOneUserAcceptedSubmission(
    idUser: string,
    language: string,
    idProblem: number,
  ): Promise<Submission | null>;
  findLastUserSubmission(idUser: string): Promise<Submission | null>;
  save(
    submission: Partial<Submission>,
    testResult: TestResult,
  ): Promise<Submission>;
  findAll(): Promise<Submission[]>;
  findOneById(id: string): Promise<Submission | null>;
  findAllByUserId(idUser: string): Promise<Submission[]>;
  updateById(
    id: string,
    updateSubmission: Partial<Submission>,
  ): Promise<Submission | null>;
  remove(id: string): Promise<void>;
}

export const SubmissionRepositoryPort = Symbol('SubmissionRepositoryPort');
