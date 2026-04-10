import { NotFoundException } from '@nestjs/common';
import { ReturnTestCaseDto } from 'src/modules/test-case/dto/return-test-case.dto';
import { TestCaseService } from 'src/modules/problem/service/test-case.service';
import { ProblemFactory } from 'test/factories/problem.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';

describe('TestCaseService', () => {
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let service: TestCaseService;

  beforeEach(() => {
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();

    service = new TestCaseService(
      testCaseRepositoryMock as any,
      problemRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Create Test Case', () => {
    it('should create a test case when problem exists', async () => {
      const createTestCaseDto = TestCaseFactory.makeCreateTestCaseDto();
      const savedProblem = ProblemFactory.makeProblemEntity();
      const createdTestCase = TestCaseFactory.makeTestCaseEntity();
      const savedTestCase = TestCaseFactory.makeTestCaseEntity();

      problemRepositoryMock.findOneBy.mockResolvedValue(savedProblem);
      testCaseRepositoryMock.create.mockReturnValue(createdTestCase);
      testCaseRepositoryMock.save.mockResolvedValue(savedTestCase);

      const result = await service.create({ ...createTestCaseDto });

      expect(problemRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: createTestCaseDto.id_problem,
      });

      expect(problemRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);

      expect(testCaseRepositoryMock.create).toHaveBeenCalledWith(
        createTestCaseDto,
      );
      expect(testCaseRepositoryMock.save).toHaveBeenCalledWith(createdTestCase);

      expect(result).toBeInstanceOf(ReturnTestCaseDto);
      expect(result).toMatchObject(TestCaseFactory.makeReturnTestCaseDto());
    });

    it('should throw not found exception when problem does not exist', async () => {
      const createTestCaseDto = TestCaseFactory.makeCreateTestCaseDto();

      problemRepositoryMock.findOneBy.mockResolvedValue(null);

      const createPromise = service.create({ ...createTestCaseDto });

      await expect(createPromise).rejects.toThrow(NotFoundException);
      await expect(createPromise).rejects.toThrow('Problem not found');

      expect(problemRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: createTestCaseDto.id_problem,
      });

      expect(problemRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(testCaseRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('Find all Test Cases', () => {
    it('should return a list of ReturnTestCaseDto', async () => {
      const testCaseEntity = TestCaseFactory.makeTestCaseEntity();
      testCaseRepositoryMock.find.mockResolvedValue([testCaseEntity]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ReturnTestCaseDto);
      expect(testCaseRepositoryMock.find).toHaveBeenCalled();

      expect(result[0]).toMatchObject({
        id: testCaseEntity.id,
        id_problem: testCaseEntity.id_problem,
        input: testCaseEntity.input,
        output: testCaseEntity.output,
      });
    });
  });

  describe('Get Test Case By Id', () => {
    it('should return a test case entity when id matches', async () => {
      const testCaseEntity = TestCaseFactory.makeTestCaseEntity();
      testCaseRepositoryMock.findOneBy.mockResolvedValue(testCaseEntity);

      const result = await service.findOneById(testCaseEntity.id);

      expect(result).toBeInstanceOf(ReturnTestCaseDto);
      expect(result).toMatchObject({
        id: testCaseEntity.id,
        id_problem: testCaseEntity.id_problem,
        input: testCaseEntity.input,
        output: testCaseEntity.output,
      });
      expect(testCaseRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: testCaseEntity.id,
      });
    });

    it('should throw not found exception when id does not match', async () => {
      testCaseRepositoryMock.findOneBy.mockResolvedValue(null);

      const findPromise = service.findOneById('123');

      await expect(findPromise).rejects.toThrow(NotFoundException);
      await expect(findPromise).rejects.toThrow('Test case not found');
    });
  });

  describe('Get All Test Case By Problem Id', () => {
    it('should return a list of ReturnTestCaseDto', async () => {
      const testCaseEntity = TestCaseFactory.makeTestCaseEntity();
      testCaseRepositoryMock.findBy.mockResolvedValue([testCaseEntity]);

      const result = await service.findAllByProblemId(1);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ReturnTestCaseDto);
      expect(testCaseRepositoryMock.findBy).toHaveBeenCalledWith({
        id_problem: 1,
      });

      expect(result[0]).toMatchObject({
        id: testCaseEntity.id,
        id_problem: testCaseEntity.id_problem,
        input: testCaseEntity.input,
        output: testCaseEntity.output,
      });
    });
  });

  describe('Update Test Case', () => {
    it('should update a test case and return update result', async () => {
      const testCaseId = '123';
      const updateTestCaseDto = {
        input: '12',
        output: '144',
      };

      const updateResult = {
        affected: 1,
        generatedMaps: [],
        raw: [],
      };

      testCaseRepositoryMock.update.mockResolvedValue(updateResult);

      const result = await service.update(testCaseId, updateTestCaseDto);

      expect(testCaseRepositoryMock.update).toHaveBeenCalledWith(
        testCaseId,
        updateTestCaseDto,
      );
      expect(testCaseRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updateResult);
    });
  });

  describe('Delete Test Case', () => {
    it('should delete a test case and return delete result', async () => {
      const testCaseId = '123';
      const deleteResult = {
        affected: 1,
        raw: [],
      };

      testCaseRepositoryMock.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(testCaseId);

      expect(testCaseRepositoryMock.delete).toHaveBeenCalledWith(testCaseId);
      expect(testCaseRepositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual(deleteResult);
    });
  });
});
