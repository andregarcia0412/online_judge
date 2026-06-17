import { ExecuteCodeDto } from 'src/shared/provider/code-runner/dto/execute-code.dto';

export interface CodeRunnerProviderPort {
  ensureImageExists(imageName: string): Promise<void>;
  executeCode(
    userCode: string,
    languageName: string,
    input: string,
  ): Promise<ExecuteCodeDto>;
  getAllowedLanguages(): string[];
}

export const CodeRunnerProviderPort = Symbol('CodeRunnerProviderPort');
