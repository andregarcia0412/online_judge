import { NotFoundException } from '@nestjs/common';
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

  it('should delegate to the repository and return the updated test case', async () => {
    const testCaseId = '123';
    const updateTestCaseDto = {
      input: '12',
      output: '144',
    };
    const updatedTestCase = TestCaseFactory.makeTestCaseEntity();

    testCaseRepositoryMock.updateById.mockResolvedValue(updatedTestCase);

    const result = await useCase.execute(testCaseId, updateTestCaseDto);

    expect(testCaseRepositoryMock.updateById).toHaveBeenCalledWith(
      testCaseId,
      updateTestCaseDto,
    );
    expect(testCaseRepositoryMock.updateById).toHaveBeenCalledTimes(1);
    expect(result).toEqual(updatedTestCase);
  });

  it('should throw NotFoundException when the test case does not exist', async () => {
    testCaseRepositoryMock.updateById.mockResolvedValue(null);

    await expect(
      useCase.execute('123', { input: '12', output: '144' }),
    ).rejects.toThrow(new NotFoundException('Test case not found'));
  });
});
