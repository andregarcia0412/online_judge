import { CreateTestCaseDto } from '../../dto/test-case/create-test-case.dto';
import { ReturnTestCaseDto } from '../../dto/test-case/return-test-case.dto';
import { UpdateTestCaseDto } from '../../dto/test-case/update-test-case.dto';
import { TestCase } from '../../entities/test-case.entity';

export interface TestCaseServicePort {
  create(createTestCaseDto: CreateTestCaseDto): Promise<ReturnTestCaseDto>;
  findAll(): Promise<ReturnTestCaseDto[]>;
  findOneById(id: string): Promise<ReturnTestCaseDto>;
  findTestCaseEntityById(id: string): Promise<TestCase>;
  findAllByProblemId(idProblem: number): Promise<ReturnTestCaseDto[]>;
  findAllEntitiesByProblemId(idProblem: number): Promise<TestCase[]>;
  update(
    id: string,
    updateTestCaseDto: UpdateTestCaseDto,
  ): Promise<ReturnTestCaseDto>;
  remove(id: string): Promise<void>;
}

export const TestCaseServicePort = Symbol('TestCaseServicePort');
