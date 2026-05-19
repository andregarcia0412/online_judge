import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CodeRunnerProviderPort } from '../code-runner.provider.port';
import { LANGUAGES } from './languages/languages';

@Injectable()
export class LanguageImageBootstrapService implements OnModuleInit {
  constructor(
    @Inject(CodeRunnerProviderPort)
    private readonly codeRunnerProviderPort: CodeRunnerProviderPort,
  ) {}

  onModuleInit() {
    Object.entries(LANGUAGES).forEach(async ([_, lang]) => {
      await this.codeRunnerProviderPort.ensureImageExists(lang.imageName);
    });
  }
}
