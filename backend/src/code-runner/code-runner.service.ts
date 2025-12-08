import { Injectable } from '@nestjs/common';
import Docker from 'dockerode';
import tar from 'tar-stream';

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
    imageName: string,
    fileName: string,
    input: string,
  ) {
    const container = await docker.createContainer({
      Image: imageName,
      Cmd: ['python', fileName],
      Tty: false,
      WorkingDir: '/app',

      HostConfig: {
        Memory: 128 * 1024 * 1024,
        NanoCpus: 1000000000,
        NetworkMode: 'none',
        AutoRemove: true,
      },
    });

    const codeTarStream = this.createSourceCodePack(fileName, userCode);

    await container.putArchive(codeTarStream, {
      path: '/app',
    });

    await container.start();
    const start = performance.now();

    const stream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
    });

    let stdout = '';
    let stderr = '';
    let errorOcurred = false;
    await new Promise((resolve, reject) => {
      stream.on('data', (chunk) => {
        const streamType = chunk[0];
        const cleaned = chunk.slice(8).toString('utf8');

        if (streamType == 2) {
          errorOcurred = true;
          stderr += cleaned;
        } else {
          stdout += cleaned;
        }
      });

      stream.on('end', () => {
        resolve(stdout);
      });

      stream.on('err', (err) => {
        reject(err);
      });
    });

    const end = performance.now();
    const executionTime = end - start;

    return {
      output: stdout,
      errOutput: stderr,
      timeMs: executionTime,
      errorOcurred: errorOcurred,
    };
  }
}
