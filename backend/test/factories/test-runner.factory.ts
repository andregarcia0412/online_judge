import { SubmissionStatusEnum } from 'src/shared/enum/submission-status';
import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';

export class TestRunnerFactory {
  static makeTestResult(): TestResult {
    return new TestResult(
      SubmissionStatusEnum.ACCEPTED,
      10,
      '10\n',
      null,
      10,
      3,
    );
  }

  static makeTestResultServiceMock() {
    return {
      runTests: jest.fn(),
    };
  }
}
