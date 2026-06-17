import { UpdateTestCaseUseCase } from 'src/modules/problem/use-case/test-case/update.use-case';
import { TestCaseFactory } from 'test/factories/test-case.factory';

describe('UpdateTestCaseUseCase', () => {
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let useCase: UpdateTestCaseUseCase;

  beforeEach(() => {
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    useCase = new UpdateTestCaseUseCase(testCaseRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should delegate to the repository and return the update result', async () => {
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

    testCaseRepositoryMock.updateById.mockResolvedValue(updateResult);

    const result = await useCase.execute(testCaseId, updateTestCaseDto);

    expect(testCaseRepositoryMock.updateById).toHaveBeenCalledWith(
      testCaseId,
      updateTestCaseDto,
    );
    expect(testCaseRepositoryMock.updateById).toHaveBeenCalledTimes(1);
    expect(result).toEqual(updateResult);
  });
});
