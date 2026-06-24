import { FindOneByEmailUseCase } from 'src/modules/user/use-case/find-one-by-email.use-case';
import { UserFactory } from 'test/factories/user.factory';

describe('FindOneByEmailUseCase', () => {
  let userRepositoryMock: ReturnType<typeof UserFactory.makeUserRepositoryMock>;
  let useCase: FindOneByEmailUseCase;

  beforeEach(() => {
    userRepositoryMock = UserFactory.makeUserRepositoryMock();
    useCase = new FindOneByEmailUseCase(userRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return user when email matches', async () => {
    const user = UserFactory.makeUserEntity();
    userRepositoryMock.findOneByEmail.mockResolvedValue(user);

    const result = await useCase.execute(user.email);

    expect(userRepositoryMock.findOneByEmail).toHaveBeenCalledWith(user.email);
    expect(result).toBe(user);
  });

  it('should return null when email does not match', async () => {
    userRepositoryMock.findOneByEmail.mockResolvedValue(null);

    const result = await useCase.execute('missing@example.com');

    expect(userRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
      'missing@example.com',
    );
    expect(result).toBeNull();
  });
});
