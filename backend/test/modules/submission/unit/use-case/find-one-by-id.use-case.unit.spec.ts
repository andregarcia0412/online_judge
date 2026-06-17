import { NotFoundException } from '@nestjs/common';
import { FindOneSubmissionByIdUseCase } from 'src/modules/submission/use-case/find-one-by-id.use-case';
import { SubmissionFactory } from 'test/factories/submission.factory';

describe('FindOneSubmissionByIdUseCase', () => {
  let submissionRepositoryMock: ReturnType<
    typeof SubmissionFactory.makeSubmissionRepositoryMock
  >;
  let useCase: FindOneSubmissionByIdUseCase;

  beforeEach(() => {
    submissionRepositoryMock = SubmissionFactory.makeSubmissionRepositoryMock();
    useCase = new FindOneSubmissionByIdUseCase(submissionRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return submission when id matches', async () => {
    const submission = SubmissionFactory.makeSubmissionEntity();
    submissionRepositoryMock.findOneById.mockResolvedValue(submission);

    const result = await useCase.execute(submission.id);

    expect(submissionRepositoryMock.findOneById).toHaveBeenCalledWith(
      submission.id,
    );
    expect(result).toBe(submission);
  });

  it('should throw not found when id does not match', async () => {
    submissionRepositoryMock.findOneById.mockResolvedValue(null);

    const findPromise = useCase.execute('missing');

    await expect(findPromise).rejects.toThrow(NotFoundException);
    await expect(findPromise).rejects.toThrow('Submission not found');
  });
});
