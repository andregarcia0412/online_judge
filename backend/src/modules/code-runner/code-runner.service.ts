import { Injectable } from '@nestjs/common';
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

  async downloadImage(imageName: string, docker: Docker) {
    console.log(`Verificando/Baixando a imagem ${imageName}`);

    try {
      await new Promise((resolve, reject) => {
        docker.pull(imageName, (err, stream) => {
          if (err) {
            return reject(err);
          }

          docker.modem.followProgress(stream, onFinished);

          function onFinished(err, output) {
            if (err) {
              return reject(err);
            }
            resolve(output);
          }
        });
      });
    } catch (e) {
      console.log(`Erro ao baixar imagem: ${e}`);
      return;
    }

    console.log('Imagem baixada');
  }

  async executeCode(
    userCode: string,
    docker: Docker,
    language: LanguageConfig,
    input: string,
  ) {
    const container = await docker.createContainer({
      Image: language.imageName,
      Cmd: ['sh', '-c', language.runCommand],
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

    const codeTarStream = this.createSourceCodePack(
      language.fileName,
      userCode,
    );

    await container.putArchive(codeTarStream, {
      path: '/app',
    });

    await container.start();
    const start = performance.now();

    let finished = false;
    let timedOut = false;

    const timeout = setTimeout(async () => {
      if (finished) {
        return;
      }

      timedOut = true;
      try {
        await container.kill();
      } catch (e) {
        console.error(
          'Error killing container',
          e instanceof Error ? e.message : 'Unknown Error',
        );
      }
    }, language.timeoutMs);

    const stream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
    });

    let stdout = '';
    let stderr = '';
    let errorOcurred = false;
    await new Promise((resolve, reject) => {
      stream.on('data', async (chunk) => {
        const streamType = chunk[0];
        const cleaned = chunk.slice(8).toString('utf8');

        if (streamType == 2) {
          stderr += cleaned;
          errorOcurred = true;

          if (stderr.length > MAX_OUTPUT) {
            stderr = stderr.slice(0, MAX_OUTPUT);
            try {
              await container.kill();
            } catch (e) {
              console.error(
                'Error killing container',
                e instanceof Error ? e.message : 'Unknown Error',
              );
            }
          }
        } else {
          stdout += cleaned;

          if (stdout.length > MAX_OUTPUT) {
            stdout = stdout.slice(0, MAX_OUTPUT);
            try {
              await container.kill();
            } catch (e) {
              console.error(
                'Error killing container',
                e instanceof Error ? e.message : 'Unknown Error',
              );
            }
          }
        }
      });

      stream.on('end', () => {
        finished = true;
        clearTimeout(timeout);
        resolve(stdout);
      });

      stream.on('err', (err) => {
        reject(err);
      });
    });

    const end = performance.now();
    const executionTime = end - start;

    if (timedOut) {
      return {
        output: stdout,
        errOutput: 'Exceeded time limit',
        timeMs: language.timeoutMs,
        errorOcurred: true,
      };
    }

    return {
      output: stdout,
      errOutput: stderr,
      timeMs: executionTime,
      errorOcurred: errorOcurred,
    };
  }
}
