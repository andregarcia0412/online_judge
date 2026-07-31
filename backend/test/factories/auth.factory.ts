import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RefreshTokenDto } from 'src/modules/auth/dto/refresh-token.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { RefreshTokenPayload } from 'src/modules/auth/provider/jwt.provider.port';

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

  static makeRefreshTokenDto(
    refreshToken = 'valid-refresh-token',
  ): RefreshTokenDto {
    const dto = new RefreshTokenDto();
    dto.refreshToken = refreshToken;
    return dto;
  }

  static makeCreateUserDto(): CreateUserDto {
    return new CreateUserDto('new@example.com', 'newuser', '123123123');
  }

  static makeAuthUserEntity(overrides: Partial<User> = {}): User {
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

    return Object.assign(user, overrides);
  }

  static makeTokenPayload(
    overrides: Partial<RefreshTokenPayload> = {},
  ): RefreshTokenPayload {
    const issuedAt = Math.floor(Date.now() / 1000);

    return {
      sub: '123',
      jti: 'token-id',
      iat: issuedAt,
      exp: issuedAt + 604800,
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

  static makeCacheProviderMock() {
    return {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      clear: jest.fn().mockResolvedValue(undefined),
    };
  }

  static makeEmailSenderProviderMock() {
    return {
      send: jest.fn().mockResolvedValue(undefined),
    };
  }

  static makePasswordResetUseCaseMocks() {
    return {
      findActivePasswordResetCodeUseCase: { execute: jest.fn() },
      generatePasswordResetCodeUseCase: { execute: jest.fn() },
      incrementAttemptsUseCase: { execute: jest.fn() },
      invalidateAllUseCase: { execute: jest.fn() },
      markAsUsedUseCase: { execute: jest.fn() },
      validateCodeUseCase: { execute: jest.fn() },
    };
  }

  static makeConfigServiceMock() {
    return {
      get: jest.fn(),
    };
  }
}
