import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { CreateSubmissionDto } from '../dto/create-submission.dto';
import { Submission } from '../entities/submission.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSubmissionDto } from '../dto/update-submission.dto';

export interface SubmissionRepositoryPort {
  findOneUserAcceptedSubmission(
    id_user: string,
    language: string,
    id_problem: number,
  ): Promise<Submission | null>;
  findLastUserSubmission(id_user: string): Promise<Submission | null>;
  createAndSave(
    createSubmissionDto: CreateSubmissionDto,
    testResult: TestResult,
  ): Promise<Submission>;
  findAll(): Promise<Submission[]>;
  findOneById(id: string): Promise<Submission | null>;
  findAllByUserId(id_user: string): Promise<Submission[]>;
  updateById(
    id: string,
    updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<UpdateResult>;
  delete(id: string): Promise<DeleteResult>;
}

export const SubmissionRepositoryPort = Symbol('SubmissionRepositoryPort');
