import {
  ClsPluginTransactional,
  NoOpTransactionalAdapter,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ClsModule } from 'nestjs-cls';
import { ProblemRepositoryPort } from 'src/modules/problem/interface/repository/problem.repository.port';
import { CreateProblemUseCase } from 'src/modules/problem/use-case/problem/create.use-case';
import { ProblemFactory } from 'test/factories/problem.factory';

describe('CreateProblemUseCase', () => {
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let txHost: TransactionHost;
  let useCase: CreateProblemUseCase;

  beforeEach(async () => {
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();

    const moduleRef = await Test.createTestingModule({
      imports: [
        ClsModule.forRoot({
          plugins: [
            new ClsPluginTransactional({
              adapter: new NoOpTransactionalAdapter({
                tx: {},
                disableWarning: true,
              }),
            }),
          ],
        }),
      ],
      providers: [
        CreateProblemUseCase,
        { provide: ProblemRepositoryPort, useValue: problemRepositoryMock },
      ],
    }).compile();

    await moduleRef.init();

    txHost = moduleRef.get(TransactionHost);
    useCase = moduleRef.get(CreateProblemUseCase);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a problem with its relations via cascade when title does not match', async () => {
    const createProblemDto = ProblemFactory.makeCreateProblemDto();
    const savedProblem = ProblemFactory.makeProblemEntity();
    const withTransactionSpy = jest.spyOn(txHost, 'withTransaction');

    problemRepositoryMock.findByTitle.mockResolvedValue(null);
    problemRepositoryMock.createAndSave.mockResolvedValue(savedProblem);

    const result = await useCase.execute(createProblemDto);

    expect(withTransactionSpy).toHaveBeenCalledTimes(1);
    expect(problemRepositoryMock.findByTitle).toHaveBeenCalledWith(
      createProblemDto.title,
    );
    // uma única escrita: o grafo é montado e o cascade persiste os filhos
    expect(problemRepositoryMock.createAndSave).toHaveBeenCalledWith({
      ...createProblemDto,
      categories: createProblemDto.category,
      testCases: createProblemDto.testCases,
    });
    expect(result).toBe(savedProblem);
    expect(result.categories).toEqual(savedProblem.categories);
    expect(result.testCases).toEqual(savedProblem.testCases);
  });

  it('should throw ConflictException when title matches', async () => {
    const createProblemDto = ProblemFactory.makeCreateProblemDto();
    problemRepositoryMock.findByTitle.mockResolvedValue(
      ProblemFactory.makeProblemEntity(),
    );

    const createPromise = useCase.execute(createProblemDto);

    await expect(createPromise).rejects.toThrow(ConflictException);
    await expect(createPromise).rejects.toThrow(
      'A problem with this title already exists',
    );
    expect(problemRepositoryMock.createAndSave).not.toHaveBeenCalled();
  });
});
