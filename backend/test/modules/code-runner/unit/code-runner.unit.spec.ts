import { BadRequestException } from '@nestjs/common';
import { EventEmitter } from 'events';
import { CodeRunnerService } from 'src/modules/code-runner/code-runner.service';
import { LanguageConfig } from 'src/shared/provider/code-runner/infra/languages/language-config.interface';

describe('CodeRunnerService', () => {
  let service: CodeRunnerService;

  beforeEach(() => {
    service = new CodeRunnerService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ensureImageExists', () => {
    it('should skip verification when image was already verified', async () => {
      (service as any).verifiedImages.add('node:24-alpine');
      const dockerMock = {
        getImage: jest.fn(),
      };

      await service.ensureImageExists('node:24-alpine', dockerMock as any);

      expect(dockerMock.getImage).not.toHaveBeenCalled();
    });

    it('should cache image when it already exists locally', async () => {
      const inspectMock = jest.fn().mockResolvedValue({});
      const dockerMock = {
        getImage: jest.fn().mockReturnValue({ inspect: inspectMock }),
        pull: jest.fn(),
      };

      await service.ensureImageExists('python:3.9-alpine', dockerMock as any);

      expect(dockerMock.getImage).toHaveBeenCalledWith('python:3.9-alpine');
      expect(inspectMock).toHaveBeenCalledTimes(1);
      expect(dockerMock.pull).not.toHaveBeenCalled();
      expect((service as any).verifiedImages.has('python:3.9-alpine')).toBe(
        true,
      );
    });

    it('should pull image when inspect fails', async () => {
      const dockerMock = {
        getImage: jest.fn().mockReturnValue({
          inspect: jest.fn().mockRejectedValue(new Error('not found')),
        }),
        pull: jest.fn((imageName, cb) => cb(null, { id: 'stream' })),
        modem: {
          followProgress: jest.fn((stream, onFinished) => onFinished(null, [])),
        },
      };

      await service.ensureImageExists('gcc:13', dockerMock as any);

      expect(dockerMock.pull).toHaveBeenCalledWith(
        'gcc:13',
        expect.any(Function),
      );
      expect(dockerMock.modem.followProgress).toHaveBeenCalledTimes(1);
      expect((service as any).verifiedImages.has('gcc:13')).toBe(true);
    });

    it('should throw BadRequestException when image pull fails', async () => {
      const dockerMock = {
        getImage: jest.fn().mockReturnValue({
          inspect: jest.fn().mockRejectedValue(new Error('not found')),
        }),
        pull: jest.fn((imageName, cb) => cb(new Error('pull failed'))),
        modem: {
          followProgress: jest.fn(),
        },
      };

      const ensurePromise = service.ensureImageExists(
        'rust:1.76',
        dockerMock as any,
      );

      await expect(ensurePromise).rejects.toThrow(BadRequestException);
      await expect(ensurePromise).rejects.toThrow(
        'It was not possible to prepare ambient for this language',
      );
    });
  });

  describe('executeCode', () => {
    const baseLanguage: LanguageConfig = {
      name: 'python',
      imageName: 'python:3.9-alpine',
      fileName: 'main.py',
      runCommand: 'python main.py',
      timeoutMs: 2000,
    };

    const makeStatsStream = () => {
      const stream = new EventEmitter() as EventEmitter & {
        destroy: jest.Mock;
      };
      stream.destroy = jest.fn();
      return stream;
    };

    it('should return compilation error when compile command fails', async () => {
      const statsStream = makeStatsStream();
      const containerMock = {
        putArchive: jest.fn().mockResolvedValue(undefined),
        start: jest.fn().mockResolvedValue(undefined),
        stats: jest.fn().mockResolvedValue(statsStream),
        kill: jest.fn().mockResolvedValue(undefined),
      };
      const dockerMock = {
        createContainer: jest.fn().mockResolvedValue(containerMock),
      };
      const runDockerExecSpy = jest
        .spyOn(service as any, 'runDockerExec')
        .mockResolvedValueOnce({
          stdout: '',
          stderr: 'compilation error',
          exitCode: 1,
          timedOut: false,
        });

      const result = await service.executeCode(
        'print(1)',
        dockerMock as any,
        {
          ...baseLanguage,
          compileCommand: 'python -m py_compile main.py',
        },
        '',
      );

      expect(runDockerExecSpy).toHaveBeenCalledTimes(1);
      expect(result.output).toBe('');
      expect(result.errOutput).toBe('compilation error');
      expect(result.errorOcurred).toBe(true);
      expect(result.memoryUsage).toBe(0);
      expect(containerMock.kill).toHaveBeenCalledTimes(1);
    });

    it('should return time limit exceeded when run command times out', async () => {
      const statsStream = makeStatsStream();
      const containerMock = {
        putArchive: jest.fn().mockResolvedValue(undefined),
        start: jest.fn().mockResolvedValue(undefined),
        stats: jest.fn().mockResolvedValue(statsStream),
        kill: jest.fn().mockResolvedValue(undefined),
      };
      const dockerMock = {
        createContainer: jest.fn().mockResolvedValue(containerMock),
      };

      jest
        .spyOn(service as any, 'runDockerExec')
        .mockImplementationOnce(async () => {
          statsStream.emit(
            'data',
            Buffer.from('{"memory_stats":{"usage":10485760}}\n'),
          );

          return {
            stdout: 'partial output',
            stderr: '',
            exitCode: -1,
            timedOut: true,
          };
        });

      const pendingResult = service.executeCode(
        'print(input())',
        dockerMock as any,
        baseLanguage,
        '1\n',
      );

      const result = await pendingResult;

      expect(result.output).toBe('partial output');
      expect(result.errOutput).toBe('Time limit exceeded');
      expect(result.errorOcurred).toBe(true);
      expect(result.memoryUsage).toBe(10);
      expect(containerMock.kill).toHaveBeenCalledTimes(1);
      expect(statsStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should return execution output and max memory usage on success', async () => {
      const statsStream = makeStatsStream();
      const containerMock = {
        putArchive: jest.fn().mockResolvedValue(undefined),
        start: jest.fn().mockResolvedValue(undefined),
        stats: jest.fn().mockResolvedValue(statsStream),
        kill: jest.fn().mockResolvedValue(undefined),
      };
      const dockerMock = {
        createContainer: jest.fn().mockResolvedValue(containerMock),
      };

      jest
        .spyOn(service as any, 'runDockerExec')
        .mockImplementationOnce(async () => {
          statsStream.emit(
            'data',
            Buffer.from('{"memory_stats":{"usage":5242880}}\n'),
          );
          statsStream.emit(
            'data',
            Buffer.from('{"memory_stats":{"usage":8388608}}\n'),
          );

          return {
            stdout: '42\n',
            stderr: '',
            exitCode: 0,
            timedOut: false,
          };
        });

      const pendingResult = service.executeCode(
        'print(42)',
        dockerMock as any,
        baseLanguage,
        '',
      );

      const result = await pendingResult;

      expect(result.output).toBe('42\n');
      expect(result.errOutput).toBe('');
      expect(result.errorOcurred).toBe(false);
      expect(result.memoryUsage).toBe(8);
      expect(containerMock.putArchive).toHaveBeenCalledTimes(1);
      expect(containerMock.start).toHaveBeenCalledTimes(1);
      expect(containerMock.kill).toHaveBeenCalledTimes(1);
      expect(statsStream.destroy).toHaveBeenCalledTimes(1);
    });
  });
});
