import { FindAllSubmissionUseCase } from 'src/modules/submission/use-case/find-all.use-case';
import { SubmissionFactory } from 'test/factories/submission.factory';

describe('FindAllSubmissionUseCase', () => {
  let submissionRepositoryMock: ReturnType<
    typeof SubmissionFactory.makeSubmissionRepositoryMock
  >;
  let useCase: FindAllSubmissionUseCase;

  beforeEach(() => {
    submissionRepositoryMock = SubmissionFactory.makeSubmissionRepositoryMock();
    useCase = new FindAllSubmissionUseCase(submissionRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return all submissions', async () => {
    const submissions = [SubmissionFactory.makeSubmissionEntity()];
    submissionRepositoryMock.findAll.mockResolvedValue(submissions);

    const result = await useCase.execute();

    expect(submissionRepositoryMock.findAll).toHaveBeenCalledWith();
    expect(result).toBe(submissions);
  });
});
