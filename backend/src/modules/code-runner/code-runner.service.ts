import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import Docker from 'dockerode';
import { LanguageConfig } from 'src/modules/test-runner/language-config.interface';
import tar from 'tar-stream';

const MAX_OUTPUT = 10000;

@Injectable()
export class CodeRunnerService {
  createSourceCodePack(fileName: string, fileContent: string) {
    const pack = tar.pack();
    pack.entry({ name: fileName }, fileContent);
    pack.finalize();

    return pack;
  }

  private readonly logger = new Logger(CodeRunnerService.name);
  private verifiedImages = new Set<string>();

  async ensureImageExists(imageName: string, docker: Docker) {
    if (this.verifiedImages.has(imageName)) {
      return;
    }

    try {
      await docker.getImage(imageName).inspect();
      this.verifiedImages.add(imageName);
      this.logger.log(`Image ${imageName} is already available locally`);
      return;
    } catch (e) {
      this.logger.log(`Image ${imageName} not found. Starting download`);
    }

    try {
      await new Promise((resolve, reject) => {
        docker.pull(imageName, (err, stream) => {
          if (err) {
            return reject(err);
          }

          const onFinished = (err, output) => {
            if (err) {
              return reject(err);
            }
            resolve(output);
          };

          docker.modem.followProgress(stream, onFinished);
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
          if (stderr.length > MAX_OUTPUT) {
            stderr = stderr.slice(0, MAX_OUTPUT);
          }
        } else {
          stdout += cleaned;
          if (stdout.length > MAX_OUTPUT) {
            stdout = stdout.slice(0, MAX_OUTPUT);
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

  async executeCode(
    userCode: string,
    docker: Docker,
    language: LanguageConfig,
    input: string,
  ) {
    const container = await docker.createContainer({
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
      const codeTarStream = this.createSourceCodePack(
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
          return {
            output: '',
            errOutput:
              compileResult.stderr || 'Compilation time limit exceeded',
            timeMs: 0,
            errorOcurred: true,
          };
        }
      }

      const start = performance.now();

      const execResult = await this.runDockerExec(
        container,
        language.runCommand,
        language.timeoutMs,
        input,
      );

      const end = performance.now();

      const executionTime = end - start;

      if (execResult.timedOut) {
        return {
          output: execResult.stdout,
          errOutput: 'Time limit exceeded',
          timeMs: executionTime,
          errorOcurred: true,
        };
      }

      return {
        output: execResult.stdout,
        errOutput: execResult.stderr,
        timeMs: executionTime,
        errorOcurred: execResult.exitCode !== 0,
      };
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
}
