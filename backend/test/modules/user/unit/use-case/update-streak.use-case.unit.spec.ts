import { UpdateUserStreakUseCase } from 'src/modules/user/use-case/update-streak.use-case';
import { UserFactory } from 'test/factories/user.factory';

describe('UpdateUserStreakUseCase', () => {
  let userRepositoryMock: ReturnType<typeof UserFactory.makeUserRepositoryMock>;
  let useCase: UpdateUserStreakUseCase;

  beforeEach(() => {
    userRepositoryMock = UserFactory.makeUserRepositoryMock();

    useCase = new UpdateUserStreakUseCase(userRepositoryMock as any);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should reset streak and save when no last submission and streak was positive', async () => {
    const user = UserFactory.makeUserEntity();
    user.streak = 4;
    user.lastSubmissionDate = null as any;

    await useCase.execute(user);

    expect(user.streak).toBe(0);
    expect(userRepositoryMock.saveExistingEntity).toHaveBeenCalledWith(user);
  });

  it('should not save when no last submission and streak already zero', async () => {
    const user = UserFactory.makeUserEntity();
    user.streak = 0;
    user.lastSubmissionDate = null as any;

    await useCase.execute(user);

    expect(user.streak).toBe(0);
    expect(userRepositoryMock.saveExistingEntity).not.toHaveBeenCalled();
  });

  it('should not change streak when last submission was yesterday', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-10T12:00:00.000Z'));

    const user = UserFactory.makeUserEntity();
    user.streak = 3;
    user.lastSubmissionDate = new Date('2026-01-09T08:00:00.000Z');

    await useCase.execute(user);

    expect(user.streak).toBe(3);
    expect(userRepositoryMock.saveExistingEntity).not.toHaveBeenCalled();
  });

  it('should reset streak when last submission was more than one day ago', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-10T12:00:00.000Z'));

    const user = UserFactory.makeUserEntity();
    user.streak = 2;
    user.lastSubmissionDate = new Date('2026-01-08T08:00:00.000Z');

    await useCase.execute(user);

    expect(user.streak).toBe(0);
    expect(userRepositoryMock.saveExistingEntity).toHaveBeenCalledWith(user);
  });
});
