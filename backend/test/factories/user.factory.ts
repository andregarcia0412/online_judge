import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { ReturnUserDto } from 'src/modules/user/dto/return-user.dto';
import { User } from 'src/modules/user/entities/user.entity';

export class UserFactory {
  private static readonly fixedDate = new Date('2026-01-01T00:00:00.000Z');

  static makeCreateUserDto(): CreateUserDto {
    return new CreateUserDto('user@example.com', 'user', '123123123');
  }

  static makeUserEntity(): User {
    return new User(
      '123',
      'user@example.com',
      'user',
      '123123123',
      0,
      0,
      0,
      0,
      new Date(this.fixedDate.getTime()),
    );
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
}
