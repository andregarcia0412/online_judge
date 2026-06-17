import { NotFoundException } from '@nestjs/common';
import { FindOneUserByIdUseCase } from 'src/modules/user/use-case/find-one-by-id.use-case';
import { UserFactory } from 'test/factories/user.factory';

describe('FindOneUserByIdUseCase', () => {
  let userRepositoryMock: ReturnType<typeof UserFactory.makeUserRepositoryMock>;
  let useCase: FindOneUserByIdUseCase;

  beforeEach(() => {
    userRepositoryMock = UserFactory.makeUserRepositoryMock();
    useCase = new FindOneUserByIdUseCase(userRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return user when id matches', async () => {
    const user = UserFactory.makeUserEntity();
    userRepositoryMock.findOneById.mockResolvedValue(user);

    const result = await useCase.execute(user.id);

    expect(userRepositoryMock.findOneById).toHaveBeenCalledWith(user.id);
    expect(result).toBe(user);
  });

  it('should throw not found when id does not match', async () => {
    userRepositoryMock.findOneById.mockResolvedValue(null);

    const findPromise = useCase.execute('missing');

    await expect(findPromise).rejects.toThrow(NotFoundException);
    await expect(findPromise).rejects.toThrow('User not found');
  });
});
