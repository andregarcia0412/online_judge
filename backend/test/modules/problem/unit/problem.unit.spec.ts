import { ConflictException, NotFoundException } from '@nestjs/common';
import { ReturnProblemDto } from 'src/modules/problem/dto/problem/return-problem.dto';
import { ProblemService } from 'src/modules/problem/service/problem.service';
import { CategoryFactory } from 'test/factories/category.factory';
import { ProblemFactory } from 'test/factories/problem.factory';

describe('ProblemService', () => {
  let useCaseMocks: ReturnType<typeof ProblemFactory.makeProblemUseCaseMocks>;
  let service: ProblemService;

  beforeEach(() => {
    useCaseMocks = ProblemFactory.makeProblemUseCaseMocks();

    service = new ProblemService(
      useCaseMocks.createProblemUseCase as any,
      useCaseMocks.findAllProblemUseCase as any,
      useCaseMocks.findProblemByIdUseCase as any,
      useCaseMocks.findProblemByTitleUseCase as any,
      useCaseMocks.updateProblemUseCase as any,
      useCaseMocks.removeProblemUseCase as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Create Problem', () => {
    it('should delegate to CreateProblemUseCase and map to ReturnProblemDto', async () => {
      const createProblemDto = ProblemFactory.makeCreateProblemDto();
      const problemResponse = ProblemFactory.makeProblemResponse();
      const savedCategory = problemResponse.categories[0];
      const savedTestCase = problemResponse.testCases[0];

      useCaseMocks.createProblemUseCase.execute.mockResolvedValue(
        problemResponse,
      );

      const result = await service.create(createProblemDto);

      expect(useCaseMocks.createProblemUseCase.execute).toHaveBeenCalledWith(
        createProblemDto,
      );
      expect(result).toBeInstanceOf(ReturnProblemDto);
      expect(result).toMatchObject({
        ...ProblemFactory.makeReturnProblemDto(),
        categories: [
          {
            id: savedCategory.id,
            id_problem: savedCategory.id_problem,
            category: savedCategory.category,
          },
        ],
        test_cases: [
          {
            id: savedTestCase.id,
            id_problem: savedTestCase.id_problem,
            input: savedTestCase.input,
            output: savedTestCase.output,
          },
        ],
      });
    });

    it('should propagate errors from CreateProblemUseCase', async () => {
      const createProblemDto = ProblemFactory.makeCreateProblemDto();
      const error = new ConflictException(
        'A problem with this title already exists',
      );

      useCaseMocks.createProblemUseCase.execute.mockRejectedValue(error);

      await expect(service.create(createProblemDto)).rejects.toThrow(error);
    });
  });

  describe('Find All Problems', () => {
    it('should delegate to FindAllProblemUseCase and map to ReturnProblemDto', async () => {
      const problemResponse = ProblemFactory.makeProblemResponse();

      useCaseMocks.findAllProblemUseCase.execute.mockResolvedValue([
        problemResponse,
      ]);

      const result = await service.findAll();

      expect(useCaseMocks.findAllProblemUseCase.execute).toHaveBeenCalledWith();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ReturnProblemDto);
      expect(result[0]).toMatchObject({
        id: problemResponse.problem.id,
        title: problemResponse.problem.title,
      });
    });
  });

  describe('Find Problem By Id', () => {
    it('should delegate to FindProblemByIdUseCase and map to ReturnProblemDto', async () => {
      const problemResponse = ProblemFactory.makeProblemResponse();

      useCaseMocks.findProblemByIdUseCase.execute.mockResolvedValue(
        problemResponse,
      );

      const result = await service.findOneById(problemResponse.problem.id);

      expect(useCaseMocks.findProblemByIdUseCase.execute).toHaveBeenCalledWith(
        problemResponse.problem.id,
      );
      expect(result).toBeInstanceOf(ReturnProblemDto);
      expect(result).toMatchObject({
        id: problemResponse.problem.id,
        title: problemResponse.problem.title,
      });
    });

    it('should propagate errors from FindProblemByIdUseCase', async () => {
      const error = new NotFoundException('Problem not found');

      useCaseMocks.findProblemByIdUseCase.execute.mockRejectedValue(error);

      await expect(service.findOneById(123)).rejects.toThrow(error);
    });
  });

  describe('Find Problem By Title', () => {
    it('should delegate to FindProblemByTitleUseCase and map to ReturnProblemDto', async () => {
      const problemResponse = ProblemFactory.makeProblemResponse();

      useCaseMocks.findProblemByTitleUseCase.execute.mockResolvedValue(
        problemResponse,
      );

      const result = await service.findOneByTitle(
        problemResponse.problem.title,
      );

      expect(
        useCaseMocks.findProblemByTitleUseCase.execute,
      ).toHaveBeenCalledWith(problemResponse.problem.title);
      expect(result).toBeInstanceOf(ReturnProblemDto);
      expect(result).toMatchObject({
        id: problemResponse.problem.id,
        title: problemResponse.problem.title,
      });
    });

    it('should propagate errors from FindProblemByTitleUseCase', async () => {
      const error = new NotFoundException('Problem not found');

      useCaseMocks.findProblemByTitleUseCase.execute.mockRejectedValue(error);

      await expect(service.findOneByTitle('title')).rejects.toThrow(error);
    });
  });

  describe('Update Problem', () => {
    it('should delegate to UpdateProblemUseCase and return update result', async () => {
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

      useCaseMocks.updateProblemUseCase.execute.mockResolvedValue(updateResult);

      const result = await service.update(id, updateProblemDto as any);

      expect(useCaseMocks.updateProblemUseCase.execute).toHaveBeenCalledWith(
        id,
        updateProblemDto,
      );
      expect(useCaseMocks.updateProblemUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updateResult);
    });
  });

  describe('Delete Problem', () => {
    it('should delegate to RemoveProblemUseCase and return delete result', async () => {
      const id = 1;
      const deleteResult = {
        raw: [],
        affected: 1,
      };

      useCaseMocks.removeProblemUseCase.execute.mockResolvedValue(deleteResult);

      const result = await service.remove(id);

      expect(useCaseMocks.removeProblemUseCase.execute).toHaveBeenCalledWith(id);
      expect(useCaseMocks.removeProblemUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(deleteResult);
    });
  });
});
