import { DeleteUserUseCase } from 'src/modules/user/use-case/delete.use-case';
import { UserFactory } from 'test/factories/user.factory';

describe('DeleteUserUseCase', () => {
  let userRepositoryMock: ReturnType<typeof UserFactory.makeUserRepositoryMock>;
  let useCase: DeleteUserUseCase;

  beforeEach(() => {
    userRepositoryMock = UserFactory.makeUserRepositoryMock();
    useCase = new DeleteUserUseCase(userRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should delegate deletion to the repository', async () => {
    const userId = '123';

    userRepositoryMock.delete.mockResolvedValue(undefined);

    const result = await useCase.execute(userId);

    expect(userRepositoryMock.delete).toHaveBeenCalledWith(userId);
    expect(result).toBeUndefined();
  });
});
