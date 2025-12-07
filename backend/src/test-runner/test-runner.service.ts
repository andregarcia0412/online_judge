import { Injectable } from '@nestjs/common';
import { CodeRunnerService } from 'src/code-runner/code-runner.service';
import { TestCase } from 'src/test-case/entities/test-case.entity';
import Docker from 'dockerode';
import { TestResult } from './dto/test-result.dto';

@Injectable()
export class TestRunnerService {
  constructor(private codeRunnerService: CodeRunnerService) {}

  async runTests(testCases: TestCase[], userCode: string): Promise<TestResult> {
    const docker = new Docker();
    const languages = {
      python: {
        imageName: 'python:3.9-alpine',
        fileName: 'main.py',
      },
    };

    let result: any;

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      result = await this.codeRunnerService.executeCode(
        userCode,
        docker,
        languages.python.imageName,
        languages.python.fileName,
        testCase.input,
      );

      if (testCase.output != result.output) {
        return new TestResult(
          'rejected',
          Math.trunc(result.timeMs),
          result.errorOcurred ? result.errOutput : null,
        );
      }
    }

    return new TestResult('accepted', Math.trunc(result.timeMs), null);
  }
}
