import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from 'src/modules/user/use-case/create.use-case';
import { UserFactory } from 'test/factories/user.factory';

describe('CreateUserUseCase', () => {
  let userRepositoryMock: ReturnType<typeof UserFactory.makeUserRepositoryMock>;
  let hashProviderMock: ReturnType<typeof UserFactory.makeHashProviderMock>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    userRepositoryMock = UserFactory.makeUserRepositoryMock();
    hashProviderMock = UserFactory.makeHashProviderMock();

    useCase = new CreateUserUseCase(
      userRepositoryMock as any,
      hashProviderMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should hash password and save user', async () => {
    const createUserDto = UserFactory.makeCreateUserDto();
    const savedUser = UserFactory.makeUserEntity();
    const hashed = 'hashed-password';

    userRepositoryMock.findOneByEmail.mockResolvedValue(null);
    userRepositoryMock.findOneByUsername.mockResolvedValue(null);
    hashProviderMock.generateHash.mockResolvedValue(hashed);
    userRepositoryMock.save.mockResolvedValue(savedUser);

    const result = await useCase.execute({ ...createUserDto });

    expect(userRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
      createUserDto.email,
    );
    expect(userRepositoryMock.findOneByUsername).toHaveBeenCalledWith(
      createUserDto.username,
    );
    expect(hashProviderMock.generateHash).toHaveBeenCalledWith(
      createUserDto.password,
    );
    expect(userRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashed,
      }),
    );
    expect(result).toBe(savedUser);
  });

  it('should throw conflict when email already in use', async () => {
    const createUserDto = UserFactory.makeCreateUserDto();

    userRepositoryMock.findOneByEmail.mockResolvedValue(
      UserFactory.makeUserEntity(),
    );

    const createPromise = useCase.execute({ ...createUserDto });

    await expect(createPromise).rejects.toThrow(ConflictException);
    await expect(createPromise).rejects.toThrow('This email is already in use');

    expect(userRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
      createUserDto.email,
    );
    expect(userRepositoryMock.findOneByUsername).not.toHaveBeenCalled();
    expect(hashProviderMock.generateHash).not.toHaveBeenCalled();
  });

  it('should throw conflict when username already in use', async () => {
    const createUserDto = UserFactory.makeCreateUserDto();

    userRepositoryMock.findOneByEmail.mockResolvedValue(null);
    userRepositoryMock.findOneByUsername.mockResolvedValue(
      UserFactory.makeUserEntity(),
    );

    const createPromise = useCase.execute({ ...createUserDto });

    await expect(createPromise).rejects.toThrow(ConflictException);
    await expect(createPromise).rejects.toThrow(
      'This username is already in use',
    );

    expect(userRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
      createUserDto.email,
    );
    expect(userRepositoryMock.findOneByUsername).toHaveBeenCalledWith(
      createUserDto.username,
    );
    expect(hashProviderMock.generateHash).not.toHaveBeenCalled();
  });
});
