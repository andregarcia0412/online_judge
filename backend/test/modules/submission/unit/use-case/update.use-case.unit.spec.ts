import { NotFoundException } from '@nestjs/common';
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

  it('should update submission and return the updated entity', async () => {
    const id = '123';
    const updateSubmissionDto = { text: 'print("Updated")' };
    const updatedSubmission = SubmissionFactory.makeSubmissionEntity();

    submissionRepositoryMock.updateById.mockResolvedValue(updatedSubmission);

    const result = await useCase.execute(id, updateSubmissionDto as any);

    expect(submissionRepositoryMock.updateById).toHaveBeenCalledWith(
      id,
      updateSubmissionDto,
    );
    expect(result).toBe(updatedSubmission);
  });

  it('should throw NotFoundException when the submission does not exist', async () => {
    const id = '123';
    const updateSubmissionDto = { text: 'print("Updated")' };

    submissionRepositoryMock.updateById.mockResolvedValue(null);

    const updatePromise = useCase.execute(id, updateSubmissionDto as any);

    await expect(updatePromise).rejects.toThrow(NotFoundException);
    await expect(updatePromise).rejects.toThrow('Submission not found');
  });
});
