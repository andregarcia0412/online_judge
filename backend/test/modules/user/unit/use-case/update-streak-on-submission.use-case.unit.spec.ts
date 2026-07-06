import { UpdateUserStreakOnSubmissionUseCase } from 'src/modules/user/use-case/update-streak-on-submission.use-case';
import { UserFactory } from 'test/factories/user.factory';

describe('UpdateUserStreakOnSubmissionUseCase', () => {
  let useCase: UpdateUserStreakOnSubmissionUseCase;

  beforeEach(() => {
    useCase = new UpdateUserStreakOnSubmissionUseCase();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should set streak to 1 when there is no previous submission', () => {
    const user = UserFactory.makeUserEntity();
    user.streak = 0;
    user.lastSubmissionDate = null as any;

    useCase.execute(user);

    expect(user.streak).toBe(1);
  });

  it('should keep streak when previous submission is today', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-10T12:00:00.000Z'));

    const user = UserFactory.makeUserEntity();
    user.streak = 3;
    user.lastSubmissionDate = new Date('2026-01-10T01:00:00.000Z');

    useCase.execute(user);

    expect(user.streak).toBe(3);
  });

  it('should increment streak when previous submission was yesterday', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-10T12:00:00.000Z'));

    const user = UserFactory.makeUserEntity();
    user.streak = 2;
    user.lastSubmissionDate = new Date('2026-01-09T01:00:00.000Z');

    useCase.execute(user);

    expect(user.streak).toBe(3);
  });

  it('should reset streak to 1 when previous submission was more than one day ago', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-10T12:00:00.000Z'));

    const user = UserFactory.makeUserEntity();
    user.streak = 5;
    user.lastSubmissionDate = new Date('2026-01-08T01:00:00.000Z');

    useCase.execute(user);

    expect(user.streak).toBe(1);
  });
});
