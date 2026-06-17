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

  it('should delete user and return result', async () => {
    const userId = '123';
    const deleteResult = { affected: 1, raw: [] };

    userRepositoryMock.delete.mockResolvedValue(deleteResult);

    const result = await useCase.execute(userId);

    expect(userRepositoryMock.delete).toHaveBeenCalledWith(userId);
    expect(result).toEqual(deleteResult);
  });
});
