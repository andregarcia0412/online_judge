import { NotFoundException } from '@nestjs/common';
import { ReturnSubmissionDto } from 'src/modules/submission/dto/return-submission.dto';
import { SubmissionService } from 'src/modules/submission/submission.service';
import { SubmissionFactory } from 'test/factories/submission.factory';
import { TestRunnerFactory } from 'test/factories/test-runner.factory';

describe('SubmissionService', () => {
  let useCaseMocks: ReturnType<
    typeof SubmissionFactory.makeSubmissionUseCaseMocks
  >;
  let service: SubmissionService;

  beforeEach(() => {
    useCaseMocks = SubmissionFactory.makeSubmissionUseCaseMocks();

    service = new SubmissionService(
      useCaseMocks.createSubmissionUseCase as any,
      useCaseMocks.createPlaygroundSubmissionUseCase as any,
      useCaseMocks.findAllSubmissionUseCase as any,
      useCaseMocks.findOneSubmissionByIdUseCase as any,
      useCaseMocks.findAllSubmissionByUserIdUseCase as any,
      useCaseMocks.updateSubmissionUseCase as any,
      useCaseMocks.deleteSubmissionUseCase as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('should delegate to CreateSubmissionUseCase', async () => {
      const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
      const expected = SubmissionFactory.makeReturnSubmissionDto();

      useCaseMocks.createSubmissionUseCase.execute.mockResolvedValue(expected);

      const result = await service.create(createSubmissionDto);

      expect(useCaseMocks.createSubmissionUseCase.execute).toHaveBeenCalledWith(
        createSubmissionDto,
      );
      expect(result).toBe(expected);
    });

    it('should propagate errors from CreateSubmissionUseCase', async () => {
      const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
      const error = new NotFoundException('User not found');

      useCaseMocks.createSubmissionUseCase.execute.mockRejectedValue(error);

      await expect(service.create(createSubmissionDto)).rejects.toThrow(error);
    });
  });

  describe('createPlaygroundSubmission', () => {
    it('should delegate to CreatePlaygroundSubmissionUseCase', async () => {
      const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
      const expected = TestRunnerFactory.makeTestResult();

      useCaseMocks.createPlaygroundSubmissionUseCase.execute.mockResolvedValue(
        expected,
      );

      const result =
        await service.createPlaygroundSubmission(createSubmissionDto);

      expect(
        useCaseMocks.createPlaygroundSubmissionUseCase.execute,
      ).toHaveBeenCalledWith(createSubmissionDto);
      expect(result).toBe(expected);
    });

    it('should propagate errors from CreatePlaygroundSubmissionUseCase', async () => {
      const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
      const error = new NotFoundException('Problem not found');

      useCaseMocks.createPlaygroundSubmissionUseCase.execute.mockRejectedValue(
        error,
      );

      await expect(
        service.createPlaygroundSubmission(createSubmissionDto),
      ).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should map entities to ReturnSubmissionDto', async () => {
      const savedEntity = SubmissionFactory.makeSubmissionEntity();
      const expectedDto = ReturnSubmissionDto.fromEntity(savedEntity);

      useCaseMocks.findAllSubmissionUseCase.execute.mockResolvedValue([
        savedEntity,
      ]);

      const result = await service.findAll();

      expect(
        useCaseMocks.findAllSubmissionUseCase.execute,
      ).toHaveBeenCalledWith();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ReturnSubmissionDto);
      expect(result[0]).toMatchObject(expectedDto);
    });
  });

  describe('findOneById', () => {
    it('should map entity to ReturnSubmissionDto', async () => {
      const savedEntity = SubmissionFactory.makeSubmissionEntity();
      const expectedDto = ReturnSubmissionDto.fromEntity(savedEntity);

      useCaseMocks.findOneSubmissionByIdUseCase.execute.mockResolvedValue(
        savedEntity,
      );

      const result = await service.findOneById(savedEntity.id);

      expect(
        useCaseMocks.findOneSubmissionByIdUseCase.execute,
      ).toHaveBeenCalledWith(savedEntity.id);
      expect(result).toBeInstanceOf(ReturnSubmissionDto);
      expect(result).toMatchObject(expectedDto);
    });

    it('should propagate errors from FindOneSubmissionByIdUseCase', async () => {
      const error = new NotFoundException('Submission not found');

      useCaseMocks.findOneSubmissionByIdUseCase.execute.mockRejectedValue(
        error,
      );

      await expect(service.findOneById('123')).rejects.toThrow(error);
    });
  });

  describe('findAllByUserId', () => {
    it('should map entities to ReturnSubmissionDto', async () => {
      const savedEntity = SubmissionFactory.makeSubmissionEntity();
      const expectedDto = ReturnSubmissionDto.fromEntity(savedEntity);
      const userId = '123';

      useCaseMocks.findAllSubmissionByUserIdUseCase.execute.mockResolvedValue([
        savedEntity,
      ]);

      const result = await service.findAllByUserId(userId);

      expect(
        useCaseMocks.findAllSubmissionByUserIdUseCase.execute,
      ).toHaveBeenCalledWith(userId);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ReturnSubmissionDto);
      expect(result[0]).toMatchObject(expectedDto);
    });
  });

  describe('update', () => {
    it('should delegate to UpdateSubmissionUseCase and map to ReturnSubmissionDto', async () => {
      const id = '123';
      const updateSubmissionDto = { text: 'print("Updated")' };
      const updatedSubmission = SubmissionFactory.makeSubmissionEntity();

      useCaseMocks.updateSubmissionUseCase.execute.mockResolvedValue(
        updatedSubmission,
      );

      const result = await service.update(id, updateSubmissionDto as any);

      expect(useCaseMocks.updateSubmissionUseCase.execute).toHaveBeenCalledWith(
        id,
        updateSubmissionDto,
      );
      expect(result).toBeInstanceOf(ReturnSubmissionDto);
      expect(result).toMatchObject(SubmissionFactory.makeReturnSubmissionDto());
    });
  });

  describe('remove', () => {
    it('should delegate to DeleteSubmissionUseCase and resolve void', async () => {
      const id = '123';

      useCaseMocks.deleteSubmissionUseCase.execute.mockResolvedValue(undefined);

      const result = await service.remove(id);

      expect(useCaseMocks.deleteSubmissionUseCase.execute).toHaveBeenCalledWith(
        id,
      );
      expect(result).toBeUndefined();
    });
  });
});
