import { NotFoundException } from '@nestjs/common';
import { FindTestCaseByIdUseCase } from 'src/modules/problem/use-case/test-case/find-one.use-case';
import { TestCaseFactory } from 'test/factories/test-case.factory';

describe('FindTestCaseByIdUseCase', () => {
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let useCase: FindTestCaseByIdUseCase;

  beforeEach(() => {
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    useCase = new FindTestCaseByIdUseCase(testCaseRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the test case when the id matches', async () => {
    const savedTestCase = TestCaseFactory.makeTestCaseEntity();

    testCaseRepositoryMock.findOneById.mockResolvedValue(savedTestCase);

    const result = await useCase.execute(savedTestCase.id);

    expect(testCaseRepositoryMock.findOneById).toHaveBeenCalledWith(
      savedTestCase.id,
    );
    expect(result).toBe(savedTestCase);
  });

  it('should throw NotFoundException when the id does not match', async () => {
    testCaseRepositoryMock.findOneById.mockResolvedValue(null);

    const findPromise = useCase.execute('123');

    await expect(findPromise).rejects.toThrow(NotFoundException);
    await expect(findPromise).rejects.toThrow('Test case not found');
  });
});
