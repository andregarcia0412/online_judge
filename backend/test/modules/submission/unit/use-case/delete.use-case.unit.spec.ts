import { DeleteSubmissionUseCase } from 'src/modules/submission/use-case/delete.use-case';
import { SubmissionFactory } from 'test/factories/submission.factory';

describe('DeleteSubmissionUseCase', () => {
  let submissionRepositoryMock: ReturnType<
    typeof SubmissionFactory.makeSubmissionRepositoryMock
  >;
  let useCase: DeleteSubmissionUseCase;

  beforeEach(() => {
    submissionRepositoryMock = SubmissionFactory.makeSubmissionRepositoryMock();
    useCase = new DeleteSubmissionUseCase(submissionRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should delete submission and return result', async () => {
    const id = '123';
    const deleteResult = { affected: 1, raw: [] };

    submissionRepositoryMock.delete.mockResolvedValue(deleteResult);

    const result = await useCase.execute(id);

    expect(submissionRepositoryMock.delete).toHaveBeenCalledWith(id);
    expect(result).toEqual(deleteResult);
  });
});
