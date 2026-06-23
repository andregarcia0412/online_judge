import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { CreateSubmissionDto } from '../dto/create-submission.dto';
import { ReturnSubmissionDto } from '../dto/return-submission.dto';
import { UpdateSubmissionDto } from '../dto/update-submission.dto';

export interface SubmissionServicePort {
  create(
    userId: string,
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<ReturnSubmissionDto>;
  createPlaygroundSubmission(
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<TestResult>;
  findAll(): Promise<ReturnSubmissionDto[]>;
  findOneById(id: string): Promise<ReturnSubmissionDto>;
  findAllByUserId(id_user: string): Promise<ReturnSubmissionDto[]>;
  update(
    id: string,
    updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<ReturnSubmissionDto>;
  remove(id: string): Promise<void>;
}

export const SubmissionServicePort = Symbol('SubmissionServicePort');
