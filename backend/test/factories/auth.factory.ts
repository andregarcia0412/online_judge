import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { User } from 'src/modules/user/entities/user.entity';

export class AuthFactory {
  private static readonly fixedDate = new Date('2026-01-01T00:00:00.000Z');

  private static readonly defaultConfig = {
    JWT_ACCESS_SECRET: 'access-secret',
    JWT_REFRESH_SECRET: 'refresh-secret',
    JWT_ACCESS_EXPIRATION_TIME: '15m',
    JWT_REFRESH_EXPIRATION_TIME: '7d',
  } as const;

  static makeLoginDto(
    email = 'user@example.com',
    password = '123123123',
  ): LoginDto {
    const dto = new LoginDto();
    dto.email = email;
    dto.password = password;
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

  static makeJwtServiceMock() {
    return {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
      sign: jest.fn(),
      verify: jest.fn(),
    };
  }

  static makeConfigServiceMock(
    overrides: Partial<Record<string, string | undefined>> = {},
  ) {
    const values = {
      ...this.defaultConfig,
      ...overrides,
    };

    return {
      get: jest.fn((key: string) => values[key as keyof typeof values]),
      getOrThrow: jest.fn((key: string) => {
        const value = values[key as keyof typeof values];

        if (value === undefined || value === null) {
          throw new Error(`Missing config: ${key}`);
        }

        return value;
      }),
    };
  }

  static makeUserServiceMock() {
    return {
      create: jest.fn(),
      updateUserStreak: jest.fn(),
    };
  }
}
