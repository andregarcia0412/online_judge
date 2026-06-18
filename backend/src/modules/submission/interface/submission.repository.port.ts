import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { EntityManager } from 'typeorm';
import { Submission } from '../entities/submission.entity';

export interface SubmissionRepositoryPort {
  findOneUserAcceptedSubmission(
    id_user: string,
    language: string,
    id_problem: number,
    manager?: EntityManager,
  ): Promise<Submission | null>;
  findLastUserSubmission(
    id_user: string,
    manager?: EntityManager,
  ): Promise<Submission | null>;
  save(
    submission: Partial<Submission>,
    testResult: TestResult,
    manager?: EntityManager,
  ): Promise<Submission>;
  findAll(manager?: EntityManager): Promise<Submission[]>;
  findOneById(id: string, manager?: EntityManager): Promise<Submission | null>;
  findAllByUserId(
    id_user: string,
    manager?: EntityManager,
  ): Promise<Submission[]>;
  updateById(
    id: string,
    updateSubmission: Partial<Submission>,
    manager?: EntityManager,
  ): Promise<Submission | null>;
  remove(id: string, manager?: EntityManager): Promise<void>;
}

export const SubmissionRepositoryPort = Symbol('SubmissionRepositoryPort');
