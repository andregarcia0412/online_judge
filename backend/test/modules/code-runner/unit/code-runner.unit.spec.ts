import { BadRequestException } from '@nestjs/common';
import { EventEmitter } from 'events';
import { DockerProvider } from 'src/shared/provider/code-runner/docker.provider';
import { LANGUAGES } from 'src/shared/provider/code-runner/infra/languages/languages';
import { LanguageConfig } from 'src/shared/provider/code-runner/infra/languages/language-config.interface';

describe('DockerProvider', () => {
  let provider: DockerProvider;
  let tarPackMock: { createSourceCodePack: jest.Mock };

  beforeEach(() => {
    tarPackMock = {
      createSourceCodePack: jest.fn().mockReturnValue('tar-stream'),
    };

    provider = new DockerProvider(tarPackMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllowedLanguages', () => {
    it('should return language keys from config', () => {
      const allowed = provider.getAllowedLanguages().sort();
      const keys = Object.keys(LANGUAGES).sort();

      expect(allowed).toEqual(keys);
    });
  });

  describe('ensureImageExists', () => {
    it('should skip verification when image was already verified', async () => {
      (provider as any).verifiedImages.add('node:24-alpine');
      const dockerMock = {
        getImage: jest.fn(),
      };

      (provider as any).docker = dockerMock;

      await provider.ensureImageExists('node:24-alpine');

      expect(dockerMock.getImage).not.toHaveBeenCalled();
    });

    it('should cache image when it already exists locally', async () => {
      const inspectMock = jest.fn().mockResolvedValue({});
      const dockerMock = {
        getImage: jest.fn().mockReturnValue({ inspect: inspectMock }),
        pull: jest.fn(),
      };

      (provider as any).docker = dockerMock;

      await provider.ensureImageExists('python:3.9-alpine');

      expect(dockerMock.getImage).toHaveBeenCalledWith('python:3.9-alpine');
      expect(inspectMock).toHaveBeenCalledTimes(1);
      expect(dockerMock.pull).not.toHaveBeenCalled();
      expect((provider as any).verifiedImages.has('python:3.9-alpine')).toBe(
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

      (provider as any).docker = dockerMock;

      await provider.ensureImageExists('gcc:13');

      expect(dockerMock.pull).toHaveBeenCalledWith(
        'gcc:13',
        expect.any(Function),
      );
      expect(dockerMock.modem.followProgress).toHaveBeenCalledTimes(1);
      expect((provider as any).verifiedImages.has('gcc:13')).toBe(true);
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

      (provider as any).docker = dockerMock;

      const ensurePromise = provider.ensureImageExists('rust:1.76');

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

    it('should throw BadRequestException when language is invalid', async () => {
      const runPromise = provider.executeCode('print(1)', 'invalid', '');

      await expect(runPromise).rejects.toThrow(BadRequestException);
      await expect(runPromise).rejects.toThrow('Invalid language name');
    });

    it('should return compilation error when compile command fails', async () => {
      const containerMock = {
        putArchive: jest.fn().mockResolvedValue(undefined),
        start: jest.fn().mockResolvedValue(undefined),
        kill: jest.fn().mockResolvedValue(undefined),
      };
      const dockerMock = {
        createContainer: jest.fn().mockResolvedValue(containerMock),
      };
      const runDockerExecSpy = jest
        .spyOn(provider as any, 'runDockerExec')
        .mockResolvedValueOnce({
          stdout: '',
          stderr: 'compilation error',
          exitCode: 1,
          timedOut: false,
        });
      const ensureImageSpy = jest
        .spyOn(provider, 'ensureImageExists')
        .mockResolvedValue(undefined);

      (provider as any).docker = dockerMock;

      const result = await provider.executeCode('print(1)', 'c', '');

      expect(ensureImageSpy).toHaveBeenCalledWith(LANGUAGES.c.imageName);
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

      jest.spyOn(provider, 'ensureImageExists').mockResolvedValue(undefined);

      jest
        .spyOn(provider as any, 'runDockerExec')
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

      (provider as any).docker = dockerMock;

      const result = await provider.executeCode(
        'print(input())',
        'python',
        '1\n',
      );

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

      jest.spyOn(provider, 'ensureImageExists').mockResolvedValue(undefined);

      jest
        .spyOn(provider as any, 'runDockerExec')
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

      (provider as any).docker = dockerMock;

      const result = await provider.executeCode('print(42)', 'python', '');

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
