import { UpdateUserStreakOnSubmissionUseCase } from 'src/modules/user/use-case/update-streak-on-submission.use-case';
import { SubmissionFactory } from 'test/factories/submission.factory';
import { UserFactory } from 'test/factories/user.factory';

describe('UpdateUserStreakOnSubmissionUseCase', () => {
  let submissionRepositoryMock: ReturnType<
    typeof SubmissionFactory.makeSubmissionRepositoryMock
  >;
  let useCase: UpdateUserStreakOnSubmissionUseCase;

  beforeEach(() => {
    submissionRepositoryMock = SubmissionFactory.makeSubmissionRepositoryMock();
    useCase = new UpdateUserStreakOnSubmissionUseCase(
      submissionRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should set streak to 1 when no last submission', async () => {
    const user = UserFactory.makeUserEntity();
    user.streak = 0;

    submissionRepositoryMock.findLastUserSubmission.mockResolvedValue(null);

    await useCase.execute(user);

    expect(
      submissionRepositoryMock.findLastUserSubmission,
    ).toHaveBeenCalledWith(user.id, undefined);
    expect(user.streak).toBe(1);
  });

  it('should keep streak when last submission is today', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-10T12:00:00.000Z'));

    const user = UserFactory.makeUserEntity();
    user.streak = 3;

    submissionRepositoryMock.findLastUserSubmission.mockResolvedValue({
      submissionDate: new Date('2026-01-10T01:00:00.000Z'),
    } as any);

    await useCase.execute(user);

    expect(user.streak).toBe(3);
  });

  it('should increment streak when last submission was yesterday', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-10T12:00:00.000Z'));

    const user = UserFactory.makeUserEntity();
    user.streak = 2;

    submissionRepositoryMock.findLastUserSubmission.mockResolvedValue({
      submissionDate: new Date('2026-01-09T01:00:00.000Z'),
    } as any);

    await useCase.execute(user);

    expect(user.streak).toBe(3);
  });

  it('should reset streak to 1 when last submission was more than one day ago', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-10T12:00:00.000Z'));

    const user = UserFactory.makeUserEntity();
    user.streak = 5;

    submissionRepositoryMock.findLastUserSubmission.mockResolvedValue({
      submissionDate: new Date('2026-01-08T01:00:00.000Z'),
    } as any);

    await useCase.execute(user);

    expect(user.streak).toBe(1);
  });
});
