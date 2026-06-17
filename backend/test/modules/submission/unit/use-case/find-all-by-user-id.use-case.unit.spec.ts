import { FindAllSubmissionByUserIdUseCase } from 'src/modules/submission/use-case/find-all-by-user-id.use-case';
import { SubmissionFactory } from 'test/factories/submission.factory';

describe('FindAllSubmissionByUserIdUseCase', () => {
  let submissionRepositoryMock: ReturnType<
    typeof SubmissionFactory.makeSubmissionRepositoryMock
  >;
  let useCase: FindAllSubmissionByUserIdUseCase;

  beforeEach(() => {
    submissionRepositoryMock = SubmissionFactory.makeSubmissionRepositoryMock();
    useCase = new FindAllSubmissionByUserIdUseCase(
      submissionRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return submissions by user id', async () => {
    const submissions = [SubmissionFactory.makeSubmissionEntity()];
    const userId = '123';

    submissionRepositoryMock.findAllByUserId.mockResolvedValue(submissions);

    const result = await useCase.execute(userId);

    expect(submissionRepositoryMock.findAllByUserId).toHaveBeenCalledWith(
      userId,
    );
    expect(result).toBe(submissions);
  });
});
