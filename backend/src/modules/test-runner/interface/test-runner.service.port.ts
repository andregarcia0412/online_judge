import { TestCase } from 'src/modules/problem/entities/test-case.entity';
import { TestResult } from '../dto/test-result.dto';

export interface TestRunnerServicePort {
  runTests(
    testCases: TestCase[],
    userCode: string,
    selectedLanguage: string,
  ): Promise<TestResult>;
}

export const TestRunnerServicePort = Symbol('TestRunnerServicePort');
