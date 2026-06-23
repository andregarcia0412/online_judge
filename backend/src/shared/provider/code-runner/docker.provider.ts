import {
  BadRequestException,
  Inject,
  Injectable,
  Logger
} from '@nestjs/common';
import Docker from 'dockerode';
import { ExecuteCodeDto } from 'src/shared/provider/code-runner/dto/execute-code.dto';
import { TarPackProviderPort } from '../tar-pack/tar-pack.provider.port';
import { CodeRunnerProviderPort } from './code-runner.provider.port';
import { LANGUAGES } from './infra/languages/languages';

@Injectable()
export class DockerProvider implements CodeRunnerProviderPort {
  private docker = new Docker();
  private verifiedImages = new Set<string>();
  private readonly logger = new Logger(DockerProvider.name);
  private readonly maxOutput = 10000;

  constructor(
    @Inject(TarPackProviderPort)
    private readonly tarPack: TarPackProviderPort,
  ) {}

  getAllowedLanguages(): string[] {
    const languages: string[] = [];
    Object.entries(LANGUAGES).map(([key, _]) => {
      languages.push(key);
    });

    return languages;
  }

  async ensureImageExists(imageName: string) {
    if (this.verifiedImages.has(imageName)) {
      return;
    }

    try {
      await this.docker.getImage(imageName).inspect();
      this.verifiedImages.add(imageName);
      this.logger.log(`Image ${imageName} is already available locally`);
      return;
    } catch (e) {
      this.logger.log(`Image ${imageName} not found. Starting download`);
    }

    try {
      await new Promise((resolve, reject) => {
        this.docker.pull(imageName, (err, stream) => {
          if (err) {
            return reject(err);
          }

          const onFinished = (err, output) => {
            if (err) {
              return reject(err);
            }
            resolve(output);
          };

          this.docker.modem.followProgress(stream, onFinished);
        });
      });

      this.verifiedImages.add(imageName);
      this.logger.log(`Docker image ${imageName} downloaded successfully`);
    } catch (e) {
      this.logger.error(`Error downloading image ${imageName}: ${e}`);
      throw new BadRequestException(
        'It was not possible to prepare ambient for this language',
      );
    }
  }
  async executeCode(
    userCode: string,
    languageName: string,
    input: string,
  ): Promise<ExecuteCodeDto> {
    const language = LANGUAGES[languageName];

    if (!language) {
      throw new BadRequestException('Invalid language name');
    }

    await this.ensureImageExists(language.imageName);

    const container = await this.docker.createContainer({
      Image: language.imageName,
      Cmd: ['tail', '-f', '/dev/null'],
      Tty: false,
      WorkingDir: '/app',
      HostConfig: {
        Memory: 128 * 1024 * 1024,
        NanoCpus: 1000000000,
        PidsLimit: 32,
        NetworkMode: 'none',
        AutoRemove: true,
      },
    });

    try {
      const codeTarStream = this.tarPack.createSourceCodePack(
        language.fileName,
        userCode,
      );

      await container.putArchive(codeTarStream, {
        path: '/app',
      });

      await container.start();

      if (language.compileCommand) {
        const compileResult = await this.runDockerExec(
          container,
          language.compileCommand,
          15000,
        );

        if (compileResult.exitCode != 0 || compileResult.timedOut) {
          return new ExecuteCodeDto(
            '',
            compileResult.stderr || 'Compilation time limit exceeded',
            0,
            true,
            0,
          );
        }
      }

      const statsStream = (await container.stats({ stream: true })) as any;
      let maxMemoryBytes = 0;

      statsStream.on('data', (chunk: Buffer) => {
        const lines = chunk.toString('utf-8').split('\n');
        for (const line of lines) {
          if (!line.trim()) {
            continue;
          }

          try {
            const stats = JSON.parse(line);
            const currentUsage = stats.memory_stats?.usage || 0;
            if (currentUsage > maxMemoryBytes) {
              maxMemoryBytes = currentUsage;
            }
          } catch (e) {}
        }
      });

      const start = performance.now();

      const execResult = await this.runDockerExec(
        container,
        language.runCommand,
        language.timeoutMs,
        input,
      );

      const end = performance.now();

      statsStream.destroy();

      const executionTime = end - start;

      const memoryUsageMB = parseFloat(
        (maxMemoryBytes / (1024 * 1024)).toFixed(2),
      );

      if (execResult.timedOut) {
        return new ExecuteCodeDto(
          execResult.stdout,
          'Time limit exceeded',
          executionTime,
          true,
          memoryUsageMB,
        );
      }

      return new ExecuteCodeDto(
        execResult.stdout,
        execResult.stderr,
        executionTime,
        execResult.exitCode !== 0,
        memoryUsageMB,
      );
    } finally {
      try {
        await container.kill();
      } catch (e) {
        this.logger.error(
          'Error killing container',
          e instanceof Error ? e.message : 'Unknown Error',
        );
      }
    }
  }

  private async runDockerExec(
    container: Docker.Container,
    cmd: string,
    timeoutMs: number,
    input?: string,
  ) {
    const exec = await container.exec({
      Cmd: ['sh', '-c', cmd],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
    });

    const stream = (await exec.start({
      detach: false,
      hijack: true,
      Tty: false,
      stdin: true,
    })) as any;

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    return new Promise<{
      stdout: string;
      stderr: string;
      exitCode: number;
      timedOut: boolean;
    }>((resolve, reject) => {
      let finished = false;

      const timeout = setTimeout(() => {
        if (finished) {
          return;
        }

        finished = true;
        timedOut = true;

        resolve({ stdout, stderr, exitCode: -1, timedOut: true });
      }, timeoutMs);

      stream.on('data', (chunk: Buffer) => {
        const streamType = chunk[0];
        const cleaned = chunk.slice(8).toString('utf8');

        if (streamType == 2) {
          stderr += cleaned;
          if (stderr.length > this.maxOutput) {
            stderr = stderr.slice(0, this.maxOutput);
          }
        } else {
          stdout += cleaned;
          if (stdout.length > this.maxOutput) {
            stdout = stdout.slice(0, this.maxOutput);
          }
        }
      });

      stream.on('end', async () => {
        if (finished) {
          return;
        }

        finished = true;
        clearTimeout(timeout);
        const inspectData = await exec.inspect();
        resolve({
          stdout,
          stderr,
          exitCode: inspectData.ExitCode || 0,
          timedOut: false,
        });
      });

      stream.on('error', (err: any) => {
        if (finished) {
          return;
        }
        finished = true;
        clearTimeout(timeout);
        reject(err);
      });

      if (input) {
        stream.write(input);
        stream.end();
      }
    });
  }
}
