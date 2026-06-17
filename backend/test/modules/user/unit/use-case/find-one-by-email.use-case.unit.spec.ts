import { NotFoundException } from '@nestjs/common';
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

  it('should throw not found when email does not match', async () => {
    userRepositoryMock.findOneByEmail.mockResolvedValue(null);

    const findPromise = useCase.execute('missing@example.com');

    await expect(findPromise).rejects.toThrow(NotFoundException);
    await expect(findPromise).rejects.toThrow('User not found');
  });
});
