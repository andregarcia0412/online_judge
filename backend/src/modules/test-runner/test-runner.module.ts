import { Module } from '@nestjs/common';
import { CodeRunnerProviderPort } from 'src/shared/provider/code-runner/code-runner.provider.port';
import { DockerProvider } from 'src/shared/provider/code-runner/docker.provider';
import { TarPackProviderPort } from 'src/shared/provider/tar-pack/tar-pack.provider.port';
import { TarStreamProvider } from 'src/shared/provider/tar-pack/tar-stream.provider';
import { TestRunnerService } from './test-runner.service';
import { TestRunnerServicePort } from './interface/test-runner.service.port';

@Module({
  imports: [],
  providers: [
    { provide: CodeRunnerProviderPort, useClass: DockerProvider },
    { provide: TarPackProviderPort, useClass: TarStreamProvider },
    { provide: TestRunnerServicePort, useClass: TestRunnerService },
  ],
  exports: [TestRunnerServicePort],
})
export class TestRunnerModule {}
