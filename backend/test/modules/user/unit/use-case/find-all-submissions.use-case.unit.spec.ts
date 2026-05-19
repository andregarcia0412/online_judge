import { FindAllSubmissionsUseCase } from 'src/modules/user/use-case/find-all-submissions.use-case';
import { SubmissionFactory } from 'test/factories/submission.factory';

describe('FindAllSubmissionsUseCase', () => {
  let submissionRepositoryMock: ReturnType<
    typeof SubmissionFactory.makeSubmissionRepositoryMock
  >;
  let useCase: FindAllSubmissionsUseCase;

  beforeEach(() => {
    submissionRepositoryMock = SubmissionFactory.makeSubmissionRepositoryMock();
    useCase = new FindAllSubmissionsUseCase(submissionRepositoryMock as any);
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
