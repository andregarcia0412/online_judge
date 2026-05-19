import { FindAllUserUseCase } from 'src/modules/user/use-case/find-all.use-case';
import { UserFactory } from 'test/factories/user.factory';

describe('FindAllUserUseCase', () => {
  let userRepositoryMock: ReturnType<typeof UserFactory.makeUserRepositoryMock>;
  let useCase: FindAllUserUseCase;

  beforeEach(() => {
    userRepositoryMock = UserFactory.makeUserRepositoryMock();
    useCase = new FindAllUserUseCase(userRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return all users', async () => {
    const users = [UserFactory.makeUserEntity()];
    userRepositoryMock.findAll.mockResolvedValue(users);

    const result = await useCase.execute();

    expect(userRepositoryMock.findAll).toHaveBeenCalledWith();
    expect(result).toBe(users);
  });
});
