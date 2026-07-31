import { ConflictException, NotFoundException } from '@nestjs/common';
import { ReturnProblemListDto } from 'src/modules/problem/dto/problem/return-problem-list.dto';
import { ReturnProblemDto } from 'src/modules/problem/dto/problem/return-problem.dto';
import { ProblemService } from 'src/modules/problem/service/problem.service';
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
    it('should delegate to CreateProblemUseCase and map the entity to ReturnProblemDto', async () => {
      const createProblemDto = ProblemFactory.makeCreateProblemDto();
      const problem = ProblemFactory.makeProblemEntity();
      const category = problem.categories[0];
      const testCase = problem.testCases[0];

      useCaseMocks.createProblemUseCase.execute.mockResolvedValue(problem);

      const result = await service.create(createProblemDto);

      expect(useCaseMocks.createProblemUseCase.execute).toHaveBeenCalledWith(
        createProblemDto,
      );
      expect(result).toBeInstanceOf(ReturnProblemDto);
      expect(result).toMatchObject({
        id: problem.id,
        title: problem.title,
        categories: [
          {
            id: category.id,
            idProblem: category.idProblem,
            category: category.category,
          },
        ],
        testCases: [
          {
            id: testCase.id,
            idProblem: testCase.idProblem,
            input: testCase.input,
            output: testCase.output,
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
    it('should delegate to FindAllProblemUseCase and map to ReturnProblemListDto', async () => {
      const problem = ProblemFactory.makeProblemEntity();

      useCaseMocks.findAllProblemUseCase.execute.mockResolvedValue([
        [problem],
        3,
      ]);

      const result = await service.findAll({ page: 2, limit: 2 });

      expect(useCaseMocks.findAllProblemUseCase.execute).toHaveBeenCalledWith(
        2,
        2,
      );
      expect(result).toBeInstanceOf(ReturnProblemListDto);
      expect(result).toMatchObject({
        page: 2,
        limit: 2,
        totalPages: 2,
      });
      expect(result.problems).toHaveLength(1);
      expect(result.problems[0]).toBeInstanceOf(ReturnProblemDto);
      expect(result.problems[0]).toMatchObject({
        id: problem.id,
        title: problem.title,
      });
    });

    it('should default to the first page with ten items when pagination is not provided', async () => {
      const problem = ProblemFactory.makeProblemEntity();

      useCaseMocks.findAllProblemUseCase.execute.mockResolvedValue([
        [problem],
        1,
      ]);

      const result = await service.findAll({});

      expect(useCaseMocks.findAllProblemUseCase.execute).toHaveBeenCalledWith(
        1,
        10,
      );
      expect(result).toMatchObject({ page: 1, limit: 10, totalPages: 1 });
    });
  });

  describe('Find Problem By Id', () => {
    it('should delegate to FindProblemByIdUseCase and map to ReturnProblemDto', async () => {
      const problem = ProblemFactory.makeProblemEntity();

      useCaseMocks.findProblemByIdUseCase.execute.mockResolvedValue(problem);

      const result = await service.findOneById(problem.id);

      expect(useCaseMocks.findProblemByIdUseCase.execute).toHaveBeenCalledWith(
        problem.id,
      );
      expect(result).toBeInstanceOf(ReturnProblemDto);
      expect(result).toMatchObject({
        id: problem.id,
        title: problem.title,
      });
    });

    it('should propagate errors from FindProblemByIdUseCase', async () => {
      const error = new NotFoundException('Problem not found');

      useCaseMocks.findProblemByIdUseCase.execute.mockRejectedValue(error);

      await expect(service.findOneById(123)).rejects.toThrow(error);
    });
  });

  describe('Find Problem Entity By Id', () => {
    it('should delegate to FindProblemByIdUseCase and return the raw entity', async () => {
      const problem = ProblemFactory.makeProblemEntity();

      useCaseMocks.findProblemByIdUseCase.execute.mockResolvedValue(problem);

      const result = await service.findProblemEntityById(problem.id);

      expect(useCaseMocks.findProblemByIdUseCase.execute).toHaveBeenCalledWith(
        problem.id,
      );
      expect(result).not.toBeInstanceOf(ReturnProblemDto);
      expect(result).toBe(problem);
    });

    it('should propagate errors from FindProblemByIdUseCase', async () => {
      const error = new NotFoundException('Problem not found');

      useCaseMocks.findProblemByIdUseCase.execute.mockRejectedValue(error);

      await expect(service.findProblemEntityById(123)).rejects.toThrow(error);
    });
  });

  describe('Find Problem By Title', () => {
    it('should delegate to FindProblemByTitleUseCase and map to ReturnProblemDto', async () => {
      const problem = ProblemFactory.makeProblemEntity();

      useCaseMocks.findProblemByTitleUseCase.execute.mockResolvedValue(problem);

      const result = await service.findOneByTitle(problem.title);

      expect(
        useCaseMocks.findProblemByTitleUseCase.execute,
      ).toHaveBeenCalledWith(problem.title);
      expect(result).toBeInstanceOf(ReturnProblemDto);
      expect(result).toMatchObject({
        id: problem.id,
        title: problem.title,
      });
    });

    it('should propagate errors from FindProblemByTitleUseCase', async () => {
      const error = new NotFoundException('Problem not found');

      useCaseMocks.findProblemByTitleUseCase.execute.mockRejectedValue(error);

      await expect(service.findOneByTitle('title')).rejects.toThrow(error);
    });
  });

  describe('Update Problem', () => {
    it('should delegate to UpdateProblemUseCase and map the entity to ReturnProblemDto', async () => {
      const id = 1;
      const updateProblemDto = {
        title: 'Fibonacci Updated',
        points: 10,
      };
      const problem = ProblemFactory.makeProblemEntity();
      const category = problem.categories[0];
      const testCase = problem.testCases[0];

      useCaseMocks.updateProblemUseCase.execute.mockResolvedValue(problem);

      const result = await service.update(id, updateProblemDto as any);

      expect(useCaseMocks.updateProblemUseCase.execute).toHaveBeenCalledWith(
        id,
        updateProblemDto,
      );
      expect(useCaseMocks.updateProblemUseCase.execute).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toBeInstanceOf(ReturnProblemDto);
      expect(result).toMatchObject({
        id: problem.id,
        title: problem.title,
        categories: [
          {
            id: category.id,
            idProblem: category.idProblem,
            category: category.category,
          },
        ],
        testCases: [
          {
            id: testCase.id,
            idProblem: testCase.idProblem,
            input: testCase.input,
            output: testCase.output,
          },
        ],
      });
    });
  });

  describe('Delete Problem', () => {
    it('should delegate to RemoveProblemUseCase and resolve void', async () => {
      const id = 1;

      useCaseMocks.removeProblemUseCase.execute.mockResolvedValue(undefined);

      const result = await service.remove(id);

      expect(useCaseMocks.removeProblemUseCase.execute).toHaveBeenCalledWith(
        id,
      );
      expect(useCaseMocks.removeProblemUseCase.execute).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toBeUndefined();
    });
  });
});
