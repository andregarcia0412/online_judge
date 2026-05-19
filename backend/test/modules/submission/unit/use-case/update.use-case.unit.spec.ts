import { UpdateSubmissionUseCase } from 'src/modules/submission/use-case/update.use-case';
import { SubmissionFactory } from 'test/factories/submission.factory';

describe('UpdateSubmissionUseCase', () => {
  let submissionRepositoryMock: ReturnType<
    typeof SubmissionFactory.makeSubmissionRepositoryMock
  >;
  let useCase: UpdateSubmissionUseCase;

  beforeEach(() => {
    submissionRepositoryMock = SubmissionFactory.makeSubmissionRepositoryMock();
    useCase = new UpdateSubmissionUseCase(submissionRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should update submission and return result', async () => {
    const id = '123';
    const updateSubmissionDto = { text: 'print("Updated")' };
    const updateResult = { affected: 1, generatedMaps: [], raw: [] };

    submissionRepositoryMock.updateById.mockResolvedValue(updateResult);

    const result = await useCase.execute(id, updateSubmissionDto as any);

    expect(submissionRepositoryMock.updateById).toHaveBeenCalledWith(
      id,
      updateSubmissionDto,
    );
    expect(result).toEqual(updateResult);
  });
});
