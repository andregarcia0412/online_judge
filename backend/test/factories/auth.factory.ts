import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RefreshTokenDto } from 'src/modules/auth/dto/refresh-token.dto';
import { User } from 'src/modules/user/entities/user.entity';

export class AuthFactory {
  private static readonly fixedDate = new Date('2026-01-01T00:00:00.000Z');

  static makeLoginDto(
    email = 'user@example.com',
    password = '123123123',
  ): LoginDto {
    const dto = new LoginDto();
    dto.email = email;
    dto.password = password;
    return dto;
  }

  static makeRefreshTokenDto(refreshToken = 'valid-refresh-token'): RefreshTokenDto {
    const dto = new RefreshTokenDto();
    dto.refreshToken = refreshToken;
    return dto;
  }

  static makeCreateUserDto(): CreateUserDto {
    return new CreateUserDto('new@example.com', 'newuser', '123123123');
  }

  static makeAuthUserEntity(overrides: Partial<User> = {}): User {
    const user = new User(
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

    return Object.assign(user, overrides);
  }

  static makeTokenPayload(
    overrides: Partial<{ sub: string; email: string }> = {},
  ) {
    return {
      sub: '123',
      email: 'user@example.com',
      ...overrides,
    };
  }

  static makeJwtProviderMock() {
    return {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
    };
  }

  static makeUserServiceMock() {
    return {
      create: jest.fn(),
      findOneById: jest.fn(),
      findOneByEmail: jest.fn(),
      updateUserStreak: jest.fn(),
    };
  }

  static makeHashProviderMock() {
    return {
      generateHash: jest.fn(),
      compare: jest.fn(),
    };
  }
}
