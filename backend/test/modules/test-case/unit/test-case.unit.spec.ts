import { NotFoundException } from '@nestjs/common';
import { ReturnTestCaseDto } from 'src/modules/problem/dto/test-case/return-test-case.dto';
import { TestCaseService } from 'src/modules/problem/service/test-case.service';
import { TestCaseFactory } from 'test/factories/test-case.factory';

describe('TestCaseService', () => {
  let useCaseMocks: ReturnType<
    typeof TestCaseFactory.makeTestCaseUseCaseMocks
  >;
  let service: TestCaseService;

  beforeEach(() => {
    useCaseMocks = TestCaseFactory.makeTestCaseUseCaseMocks();

    service = new TestCaseService(
      useCaseMocks.createTestCaseUseCase as any,
      useCaseMocks.findAllTestCasesByProblemIdUseCase as any,
      useCaseMocks.findAllTestCasesUseCase as any,
      useCaseMocks.findTestCaseByIdUseCase as any,
      useCaseMocks.removeTestCaseUseCase as any,
      useCaseMocks.updateTestCaseUseCase as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Create Test Case', () => {
    it('should delegate to CreateTestCaseUseCase and map to ReturnTestCaseDto', async () => {
      const createTestCaseDto = TestCaseFactory.makeCreateTestCaseDto();
      const savedTestCase = TestCaseFactory.makeTestCaseEntity();

      useCaseMocks.createTestCaseUseCase.execute.mockResolvedValue(
        savedTestCase,
      );

      const result = await service.create({ ...createTestCaseDto });

      expect(useCaseMocks.createTestCaseUseCase.execute).toHaveBeenCalledWith(
        createTestCaseDto,
      );
      expect(useCaseMocks.createTestCaseUseCase.execute).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toBeInstanceOf(ReturnTestCaseDto);
      expect(result).toMatchObject(TestCaseFactory.makeReturnTestCaseDto());
    });

    it('should propagate errors thrown by the use case', async () => {
      const createTestCaseDto = TestCaseFactory.makeCreateTestCaseDto();
      const error = new NotFoundException('Problem not found');

      useCaseMocks.createTestCaseUseCase.execute.mockRejectedValue(error);

      await expect(service.create({ ...createTestCaseDto })).rejects.toThrow(
        error,
      );
    });
  });

  describe('Find all Test Cases', () => {
    it('should delegate to FindAllTestCasesUseCase and map to ReturnTestCaseDto', async () => {
      const testCaseEntity = TestCaseFactory.makeTestCaseEntity();
      useCaseMocks.findAllTestCasesUseCase.execute.mockResolvedValue([
        testCaseEntity,
      ]);

      const result = await service.findAll();

      expect(useCaseMocks.findAllTestCasesUseCase.execute).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ReturnTestCaseDto);
      expect(result[0]).toMatchObject({
        id: testCaseEntity.id,
        idProblem: testCaseEntity.idProblem,
        input: testCaseEntity.input,
        output: testCaseEntity.output,
      });
    });
  });

  describe('Get Test Case By Id', () => {
    it('should delegate to FindTestCaseByIdUseCase and map to ReturnTestCaseDto', async () => {
      const testCaseEntity = TestCaseFactory.makeTestCaseEntity();
      useCaseMocks.findTestCaseByIdUseCase.execute.mockResolvedValue(
        testCaseEntity,
      );

      const result = await service.findOneById(testCaseEntity.id);

      expect(result).toBeInstanceOf(ReturnTestCaseDto);
      expect(result).toMatchObject({
        id: testCaseEntity.id,
        idProblem: testCaseEntity.idProblem,
        input: testCaseEntity.input,
        output: testCaseEntity.output,
      });
      expect(useCaseMocks.findTestCaseByIdUseCase.execute).toHaveBeenCalledWith(
        testCaseEntity.id,
      );
    });

    it('should propagate not found exception thrown by the use case', async () => {
      const error = new NotFoundException('Test case not found');
      useCaseMocks.findTestCaseByIdUseCase.execute.mockRejectedValue(error);

      await expect(service.findOneById('123')).rejects.toThrow(error);
    });
  });

  describe('Get All Test Case By Problem Id', () => {
    it('should delegate to FindAllTestCasesByProblemIdUseCase and map to ReturnTestCaseDto', async () => {
      const testCaseEntity = TestCaseFactory.makeTestCaseEntity();
      useCaseMocks.findAllTestCasesByProblemIdUseCase.execute.mockResolvedValue([
        testCaseEntity,
      ]);

      const result = await service.findAllByProblemId(1);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ReturnTestCaseDto);
      expect(
        useCaseMocks.findAllTestCasesByProblemIdUseCase.execute,
      ).toHaveBeenCalledWith(1);

      expect(result[0]).toMatchObject({
        id: testCaseEntity.id,
        idProblem: testCaseEntity.idProblem,
        input: testCaseEntity.input,
        output: testCaseEntity.output,
      });
    });
  });

  describe('Find Test Case Entity By Id', () => {
    it('should delegate to FindTestCaseByIdUseCase and return the raw entity', async () => {
      const testCaseEntity = TestCaseFactory.makeTestCaseEntity();
      useCaseMocks.findTestCaseByIdUseCase.execute.mockResolvedValue(
        testCaseEntity,
      );

      const result = await service.findTestCaseEntityById(testCaseEntity.id);

      expect(result).not.toBeInstanceOf(ReturnTestCaseDto);
      expect(result).toBe(testCaseEntity);
      expect(useCaseMocks.findTestCaseByIdUseCase.execute).toHaveBeenCalledWith(
        testCaseEntity.id,
      );
    });

    it('should propagate not found exception thrown by the use case', async () => {
      const error = new NotFoundException('Test case not found');
      useCaseMocks.findTestCaseByIdUseCase.execute.mockRejectedValue(error);

      await expect(service.findTestCaseEntityById('123')).rejects.toThrow(error);
    });
  });

  describe('Find All Test Case Entities By Problem Id', () => {
    it('should delegate to FindAllTestCasesByProblemIdUseCase and return the raw entities', async () => {
      const testCaseEntity = TestCaseFactory.makeTestCaseEntity();
      useCaseMocks.findAllTestCasesByProblemIdUseCase.execute.mockResolvedValue([
        testCaseEntity,
      ]);

      const result = await service.findAllEntitiesByProblemId(1);

      expect(result).toHaveLength(1);
      expect(result[0]).not.toBeInstanceOf(ReturnTestCaseDto);
      expect(result[0]).toBe(testCaseEntity);
      expect(
        useCaseMocks.findAllTestCasesByProblemIdUseCase.execute,
      ).toHaveBeenCalledWith(1);
    });

    it('should propagate errors thrown by the use case', async () => {
      const error = new NotFoundException('Problem not found');
      useCaseMocks.findAllTestCasesByProblemIdUseCase.execute.mockRejectedValue(
        error,
      );

      await expect(service.findAllEntitiesByProblemId(1)).rejects.toThrow(error);
    });
  });

  describe('Update Test Case', () => {
    it('should delegate to UpdateTestCaseUseCase and map to ReturnTestCaseDto', async () => {
      const testCaseId = '123';
      const updateTestCaseDto = {
        input: '12',
        output: '144',
      };

      const updatedTestCase = TestCaseFactory.makeTestCaseEntity();

      useCaseMocks.updateTestCaseUseCase.execute.mockResolvedValue(
        updatedTestCase,
      );

      const result = await service.update(testCaseId, updateTestCaseDto);

      expect(useCaseMocks.updateTestCaseUseCase.execute).toHaveBeenCalledWith(
        testCaseId,
        updateTestCaseDto,
      );
      expect(useCaseMocks.updateTestCaseUseCase.execute).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toBeInstanceOf(ReturnTestCaseDto);
      expect(result).toMatchObject({
        id: updatedTestCase.id,
        idProblem: updatedTestCase.idProblem,
        input: updatedTestCase.input,
        output: updatedTestCase.output,
      });
    });
  });

  describe('Delete Test Case', () => {
    it('should delegate to RemoveTestCaseUseCase and resolve void', async () => {
      const testCaseId = '123';

      useCaseMocks.removeTestCaseUseCase.execute.mockResolvedValue(undefined);

      const result = await service.remove(testCaseId);

      expect(useCaseMocks.removeTestCaseUseCase.execute).toHaveBeenCalledWith(
        testCaseId,
      );
      expect(useCaseMocks.removeTestCaseUseCase.execute).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toBeUndefined();
    });
  });
});
