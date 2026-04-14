import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { CreateSubmissionDto } from '../dto/create-submission.dto';
import { Submission } from '../entities/submission.entity';
import { DeleteResult, EntityManager, UpdateResult } from 'typeorm';
import { UpdateSubmissionDto } from '../dto/update-submission.dto';

export interface SubmissionRepositoryPort {
  findOneUserAcceptedSubmission(
    id_user: string,
    language: string,
    id_problem: number,
    manager?: EntityManager,
  ): Promise<Submission | null>;
  findLastUserSubmission(id_user: string, manager?: EntityManager): Promise<Submission | null>;
  createAndSave(
    createSubmissionDto: CreateSubmissionDto,
    testResult: TestResult,
    manager?: EntityManager
  ): Promise<Submission>;
  findAll(manager?: EntityManager): Promise<Submission[]>;
  findOneById(id: string, manager?: EntityManager): Promise<Submission | null>;
  findAllByUserId(id_user: string, manager?: EntityManager): Promise<Submission[]>;
  updateById(
    id: string,
    updateSubmissionDto: UpdateSubmissionDto,
    manager?: EntityManager
  ): Promise<UpdateResult>;
  delete(id: string, manager?: EntityManager): Promise<DeleteResult>;
}

export const SubmissionRepositoryPort = Symbol('SubmissionRepositoryPort');
