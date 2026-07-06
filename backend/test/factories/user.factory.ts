import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { ReturnUserDto } from 'src/modules/user/dto/return-user.dto';
import { User } from 'src/modules/user/entities/user.entity';

export class UserFactory {
  private static readonly fixedDate = new Date('2026-01-01T00:00:00.000Z');

  static makeCreateUserDto(): CreateUserDto {
    return new CreateUserDto('user@example.com', 'user', '123123123');
  }

  static makeUserEntity(): User {
    const user = new User();
    user.id = '123';
    user.email = 'user@example.com';
    user.username = 'user';
    user.password = '123123123';
    user.points = 0;
    user.totalSubmissions = 0;
    user.totalResolved = 0;
    user.streak = 0;
    user.createdAt = new Date(this.fixedDate.getTime());
    return user;
  }

  static makeReturnUserDto(): ReturnUserDto {
    return ReturnUserDto.fromEntity(this.makeUserEntity());
  }

  static makeUserRepositoryMock() {
    const findOneByEmail = jest.fn();
    const findOneByUsername = jest.fn();
    const findOneById = jest.fn();
    const save = jest.fn();
    const saveExistingEntity = jest.fn();
    const findAll = jest.fn();
    const updateById = jest.fn();
    const deleteFn = jest.fn();

    return {
      findOneByEmail,
      findOneByUsername,
      findOneById,
      save,
      saveExistingEntity,
      findAll,
      updateById,
      delete: deleteFn,
    };
  }

  static makeUserUseCaseMocks() {
    const createUserUseCase = { execute: jest.fn() };
    const findAllUseCase = { execute: jest.fn() };
    const findOneUserByIdUseCase = { execute: jest.fn() };
    const updateUserStreakUseCase = { execute: jest.fn() };
    const findOneByEmailUseCase = { execute: jest.fn() };
    const updateUserUseCase = { execute: jest.fn() };
    const deleteUserUseCase = { execute: jest.fn() };
    const updateUserStreakOnSubmissionUseCase = { execute: jest.fn() };

    return {
      createUserUseCase,
      findAllUseCase,
      findOneUserByIdUseCase,
      updateUserStreakUseCase,
      findOneByEmailUseCase,
      updateUserUseCase,
      deleteUserUseCase,
      updateUserStreakOnSubmissionUseCase,
    };
  }

  static makeHashProviderMock() {
    return {
      generateHash: jest.fn(),
      compare: jest.fn(),
    };
  }
}
