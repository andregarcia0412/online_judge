import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { UserService } from 'src/user/user.service';
import Docker from 'dockerode';
import tar from 'tar-stream';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    private userService: UserService,
  ) {}

  async create(createSubmissionDto: CreateSubmissionDto) {
    if (!(await this.userService.findOneById(createSubmissionDto.id_user))) {
      throw new NotFoundException('User not found');
    }

    //not found pro problema

    const languages = {
      python: {
        imageName: 'python:3.9-alpine',
        fileName: 'main.py',
      },
    };
    const docker = new Docker();

    const response = await this.executeCode(
      createSubmissionDto.text,
      docker,
      languages.python.imageName,
      languages.python.fileName,
    );

    const newSubmission = this.submissionRepository.create({
      ...createSubmissionDto,
      status: 'accepted',
      execution_time: Math.trunc(response.timeMs),
      error: response.errorOcurred ? response.errOutput : null,
    });

    console.log(response);

    return this.submissionRepository.save(newSubmission);
  }

  findAll() {
    return this.submissionRepository.find();
  }

  findOneById(id_submission: number) {
    return this.submissionRepository.findOneBy({ id_submission });
  }

  findAllByUserId(id_user: number) {
    return this.submissionRepository.findBy({ id_user });
  }

  update(id_submission: number, updateSubmissionDto: UpdateSubmissionDto) {
    return this.submissionRepository.update(id_submission, updateSubmissionDto);
  }

  remove(id_submission: number) {
    return this.submissionRepository.delete(id_submission);
  }

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
  ) {
    await this.downloadImage(imageName, docker);

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

    const start = performance.now();
    await container.start();

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
