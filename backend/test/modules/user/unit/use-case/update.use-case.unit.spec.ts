import { UpdateUserUseCase } from 'src/modules/user/use-case/update.use-case';
import { UserFactory } from 'test/factories/user.factory';

describe('UpdateUserUseCase', () => {
  let userRepositoryMock: ReturnType<typeof UserFactory.makeUserRepositoryMock>;
  let useCase: UpdateUserUseCase;

  beforeEach(() => {
    userRepositoryMock = UserFactory.makeUserRepositoryMock();
    useCase = new UpdateUserUseCase(userRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should update user and return result', async () => {
    const userId = '123';
    const updateUserDto = { username: 'updated' };
    const updateResult = { affected: 1, generatedMaps: [], raw: [] };

    userRepositoryMock.updateById.mockResolvedValue(updateResult);

    const result = await useCase.execute(userId, updateUserDto as any);

    expect(userRepositoryMock.updateById).toHaveBeenCalledWith(
      userId,
      updateUserDto,
    );
    expect(result).toEqual(updateResult);
  });
});
