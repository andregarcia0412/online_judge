import { ConflictException, NotFoundException } from '@nestjs/common';
import { ReturnProblemDto } from 'src/modules/problem/dto/problem/return-problem.dto';
import { ProblemService } from 'src/modules/problem/service/problem.service';
import { ReturnTestCaseDto } from 'src/modules/test-case/dto/return-test-case.dto';
import { ProblemFactory } from 'test/factories/problem.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';

describe('ProblemService', () => {
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let service: ProblemService;

  beforeEach(() => {
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();

    service = new ProblemService(
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Create Problem', () => {
    it('should create a problem and return ReturnProblemDto when title does not match', async () => {
      const createProblemDto = ProblemFactory.makeCreateProblemDto();
      const createdProblem = ProblemFactory.makeProblemEntity();
      const savedProblem = ProblemFactory.makeProblemEntity();

      problemRepositoryMock.findOneBy.mockResolvedValue(null);
      problemRepositoryMock.create.mockReturnValue(createdProblem);
      problemRepositoryMock.save.mockResolvedValue(savedProblem);

      const result = await service.create({ ...createProblemDto });

      expect(problemRepositoryMock.create).toHaveBeenCalledWith(
        createProblemDto,
      );
      expect(problemRepositoryMock.save).toHaveBeenCalledWith(createdProblem);
      expect(result).toBeInstanceOf(ReturnProblemDto);
      expect(result).toMatchObject(ProblemFactory.makeReturnProblemDto());
    });

    it('should throw ConflictException when title matches', async () => {
      const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
      const testCaseRepositoryMock =
        TestCaseFactory.makeTestCaseRepositoryMock();

      const service = new ProblemService(
        problemRepositoryMock as any,
        testCaseRepositoryMock as any,
      );

      const createProblemDto = ProblemFactory.makeCreateProblemDto();
      problemRepositoryMock.findOneBy.mockResolvedValue(
        ProblemFactory.makeProblemEntity(),
      );

      const createPromise = service.create(createProblemDto);

      await expect(createPromise).rejects.toThrow(ConflictException);
      await expect(createPromise).rejects.toThrow(
        'A problem with this title already exists',
      );
    });
  });

  describe('Find all problems', () => {
    it('should return a list of problems', async () => {
      const savedEntity = ProblemFactory.makeProblemEntity();
      problemRepositoryMock.find.mockResolvedValue([savedEntity]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(problemRepositoryMock.find).toHaveBeenCalledTimes(1);
      expect(result[0]).toBeInstanceOf(ReturnProblemDto);
      expect(result[0]).toMatchObject({
        id: savedEntity.id,
        title: savedEntity.title,
        points: savedEntity.points,
        author: savedEntity.author,
        description: savedEntity.description,
        input_description: savedEntity.input_description,
        output_description: savedEntity.output_description,
        input_example: savedEntity.input_example,
        output_example: savedEntity.output_example,
        creation_date: savedEntity.creation_date,
      });
    });
  });

  describe('Find Problem By Id', () => {
    it('should return ReturnProblemDto when id matches', async () => {
      const problemEntity = ProblemFactory.makeProblemEntity();
      problemRepositoryMock.findOneBy.mockResolvedValue(problemEntity);

      const result = await service.findOneById(problemEntity.id);

      expect(result).toBeInstanceOf(ReturnProblemDto);
      expect(result).toMatchObject({
        id: problemEntity.id,
        title: problemEntity.title,
        points: problemEntity.points,
        author: problemEntity.author,
        description: problemEntity.description,
        input_description: problemEntity.input_description,
        output_description: problemEntity.output_description,
        input_example: problemEntity.input_example,
        output_example: problemEntity.output_example,
        creation_date: problemEntity.creation_date,
      });
      expect(problemRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: problemEntity.id,
      });
    });

    it('should throw NotFoundException when id does not match', async () => {
      problemRepositoryMock.findOneBy.mockResolvedValue(null);

      const findPromise = service.findOneById(1);

      await expect(findPromise).rejects.toThrow(NotFoundException);
      await expect(findPromise).rejects.toThrow('Problem not found');
    });
  });

  describe('Find Problem By Title', () => {
    it('should return ReturnProblemDto when title matches', async () => {
      const problemEntity = ProblemFactory.makeProblemEntity();

      problemRepositoryMock.findOneBy.mockResolvedValue(problemEntity);

      const result = await service.findOneByTitle(problemEntity.title);

      expect(result).toBeInstanceOf(ReturnProblemDto);
      expect(result).toMatchObject({
        id: problemEntity.id,
        title: problemEntity.title,
        points: problemEntity.points,
        author: problemEntity.author,
        description: problemEntity.description,
        input_description: problemEntity.input_description,
        output_description: problemEntity.output_description,
        input_example: problemEntity.input_example,
        output_example: problemEntity.output_example,
        creation_date: problemEntity.creation_date,
      });
      expect(problemRepositoryMock.findOneBy).toHaveBeenCalledWith({
        title: problemEntity.title,
      });
    });

    it('should throw NotFoundException when title does not match', async () => {
      problemRepositoryMock.findOneBy.mockResolvedValue(null);

      const findPromise = service.findOneByTitle('title');

      await expect(findPromise).rejects.toThrow(NotFoundException);
      await expect(findPromise).rejects.toThrow('Problem not found');
    });
  });

  describe('Find All Test Cases By Id', () => {
    it('should return a list of ReturnTestCaseDto', async () => {
      const problemId = 1;
      const savedTestCase = TestCaseFactory.makeTestCaseEntity();
      testCaseRepositoryMock.findBy.mockResolvedValue([savedTestCase]);

      const result = await service.findAllTestCasesById(problemId);

      expect(result).toHaveLength(1);
      expect(testCaseRepositoryMock.findBy).toHaveBeenCalledWith({
        id_problem: problemId,
      });
      expect(result[0]).toBeInstanceOf(ReturnTestCaseDto);
      expect(result[0]).toMatchObject({
        id: savedTestCase.id,
        id_problem: savedTestCase.id_problem,
        input: savedTestCase.input,
        output: savedTestCase.output,
      });
    });
  });

  describe('Update Problem', () => {
    it('should update problem and return UpdateResult', async () => {
      const id = 1;
      const updateProblemDto = {
        title: 'Fibonacci Updated',
        points: 10,
      };
      const updateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };

      problemRepositoryMock.update.mockResolvedValue(updateResult);

      const result = await service.update(id, updateProblemDto as any);

      expect(problemRepositoryMock.update).toHaveBeenCalledWith(
        id,
        updateProblemDto,
      );
      expect(result).toEqual(updateResult);
    });
  });

  describe('Delete Problem', () => {
    it('should delete problem and return DeleteResult', async () => {
      const id = 1;
      const deleteResult = {
        raw: [],
        affected: 1,
      };

      problemRepositoryMock.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(id);

      expect(problemRepositoryMock.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deleteResult);
    });
  });
});
