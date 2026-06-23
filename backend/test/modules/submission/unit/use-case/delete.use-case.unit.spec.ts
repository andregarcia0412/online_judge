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

  it('should delegate to the repository remove and resolve void', async () => {
    const id = '123';

    submissionRepositoryMock.remove.mockResolvedValue(undefined);

    const result = await useCase.execute(id);

    expect(submissionRepositoryMock.remove).toHaveBeenCalledWith(id);
    expect(submissionRepositoryMock.remove).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});
