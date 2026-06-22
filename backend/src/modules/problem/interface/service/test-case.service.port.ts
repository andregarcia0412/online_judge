import { UpdateResult } from 'typeorm';
import { CreateTestCaseDto } from '../../dto/test-case/create-test-case.dto';
import { ReturnTestCaseDto } from '../../dto/test-case/return-test-case.dto';
import { UpdateTestCaseDto } from '../../dto/test-case/update-test-case.dto';

export interface TestCaseServicePort {
  create(createTestCaseDto: CreateTestCaseDto): Promise<ReturnTestCaseDto>;
  findAll(): Promise<ReturnTestCaseDto[]>;
  findOneById(id: string): Promise<ReturnTestCaseDto>;
  findAllByProblemId(id_problem: number): Promise<ReturnTestCaseDto[]>;
  update(
    id: string,
    updateTestCaseDto: UpdateTestCaseDto,
  ): Promise<UpdateResult>;
  remove(id: string): Promise<void>;
}

export const TestCaseServicePort = Symbol('TestCaseServicePort');
