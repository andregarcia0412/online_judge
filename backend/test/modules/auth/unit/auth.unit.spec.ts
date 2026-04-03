import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthResponseDto } from 'src/modules/auth/dto/auth.dto';
import { RefreshResponseDto } from 'src/modules/auth/dto/refresh-response.dto';
import { ReturnUserDto } from 'src/modules/user/dto/return-user.dto';
import { AuthFactory } from 'test/factories/auth.factory';
import { UserFactory } from 'test/factories/user.factory';

describe('AuthService', () => {
  let userRepositoryMock: ReturnType<typeof UserFactory.makeUserRepositoryMock>;
  let userServiceMock: ReturnType<typeof AuthFactory.makeUserServiceMock>;
  let jwtServiceMock: ReturnType<typeof AuthFactory.makeJwtServiceMock>;
  let configServiceMock: ReturnType<typeof AuthFactory.makeConfigServiceMock>;
  let service: AuthService;

  beforeEach(() => {
    userRepositoryMock = UserFactory.makeUserRepositoryMock();
    userServiceMock = AuthFactory.makeUserServiceMock();
    jwtServiceMock = AuthFactory.makeJwtServiceMock();
    configServiceMock = AuthFactory.makeConfigServiceMock();

    service = new AuthService(
      userRepositoryMock as any,
      userServiceMock as any,
      jwtServiceMock as any,
      configServiceMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Login', () => {
    it('should return AuthResponseDto when email and password are valid', async () => {
      const plainPassword = '123123123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      const user = AuthFactory.makeAuthUserEntity({ password: hashedPassword });
      const loginDto = AuthFactory.makeLoginDto(user.email, plainPassword);

      userRepositoryMock.findOneBy.mockResolvedValue(user);
      jwtServiceMock.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.login(loginDto);

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });

      expect(jwtServiceMock.signAsync).toHaveBeenNthCalledWith(
        1,
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: 'access-secret',
          expiresIn: '15m',
        },
      );

      expect(jwtServiceMock.signAsync).toHaveBeenNthCalledWith(
        2,
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: 'refresh-secret',
          expiresIn: '7d',
        },
      );

      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(result).toMatchObject({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(result.user).toBeInstanceOf(ReturnUserDto);
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw BadRequestException when user does not exist', async () => {
      const loginDto = AuthFactory.makeLoginDto();
      userRepositoryMock.findOneBy.mockResolvedValue(null);

      const loginPromise = service.login(loginDto);

      await expect(loginPromise).rejects.toThrow(BadRequestException);
      await expect(loginPromise).rejects.toThrow('Incorrect email or password');
      expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when password does not match', async () => {
      const hashedPassword = await bcrypt.hash('different-password', 10);
      const user = AuthFactory.makeAuthUserEntity({ password: hashedPassword });
      const loginDto = AuthFactory.makeLoginDto(user.email, '123123123');

      userRepositoryMock.findOneBy.mockResolvedValue(user);

      const loginPromise = service.login(loginDto);

      await expect(loginPromise).rejects.toThrow(BadRequestException);
      await expect(loginPromise).rejects.toThrow('Incorrect email or password');
      expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
    });

    it('should propagate error when bcrypt comparison fails', async () => {
      const user = AuthFactory.makeAuthUserEntity({
        password: undefined as unknown as string,
      });
      const loginDto = AuthFactory.makeLoginDto(user.email, '123123123');

      userRepositoryMock.findOneBy.mockResolvedValue(user);

      await expect(service.login(loginDto)).rejects.toThrow();
      expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('Refresh', () => {
    it('should return RefreshResponseDto when refresh token is valid', async () => {
      const user = AuthFactory.makeAuthUserEntity();
      const payload = AuthFactory.makeTokenPayload({
        sub: user.id,
        email: user.email,
      });

      jwtServiceMock.verifyAsync.mockResolvedValue(payload);
      userRepositoryMock.findOneBy.mockResolvedValue(user);
      jwtServiceMock.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      const result = await service.refresh('valid-refresh-token');

      expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith(
        'valid-refresh-token',
        {
          secret: 'refresh-secret',
        },
      );
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: payload.sub,
      });
      expect(result).toBeInstanceOf(RefreshResponseDto);
      expect(result).toMatchObject({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      jwtServiceMock.verifyAsync.mockRejectedValue(new Error('jwt malformed'));

      const refreshPromise = service.refresh('invalid-token');

      await expect(refreshPromise).rejects.toThrow(UnauthorizedException);
      await expect(refreshPromise).rejects.toThrow('Invalid refresh token');
      expect(userRepositoryMock.findOneBy).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user does not exist after token verification', async () => {
      const payload = AuthFactory.makeTokenPayload();

      jwtServiceMock.verifyAsync.mockResolvedValue(payload);
      userRepositoryMock.findOneBy.mockResolvedValue(null);

      const refreshPromise = service.refresh('valid-token-with-deleted-user');

      await expect(refreshPromise).rejects.toThrow(UnauthorizedException);
      await expect(refreshPromise).rejects.toThrow('Invalid refresh token');
      expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token rotation fails', async () => {
      const user = AuthFactory.makeAuthUserEntity();
      const payload = AuthFactory.makeTokenPayload({ sub: user.id });

      jwtServiceMock.verifyAsync.mockResolvedValue(payload);
      userRepositoryMock.findOneBy.mockResolvedValue(user);
      jwtServiceMock.signAsync.mockRejectedValue(new Error('jwt sign failed'));

      const refreshPromise = service.refresh('valid-token');

      await expect(refreshPromise).rejects.toThrow(UnauthorizedException);
      await expect(refreshPromise).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('Register', () => {
    it('should delegate user creation to UserService and return ReturnUserDto', async () => {
      const createUserDto = AuthFactory.makeCreateUserDto();
      const returnUserDto = UserFactory.makeReturnUserDto();

      userServiceMock.create.mockResolvedValue(returnUserDto);

      const result = await service.register(createUserDto);

      expect(userServiceMock.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(returnUserDto);
    });

    it('should propagate exception when UserService.create fails', async () => {
      const createUserDto = AuthFactory.makeCreateUserDto();
      userServiceMock.create.mockRejectedValue(
        new ConflictException('This email is already in use'),
      );

      const registerPromise = service.register(createUserDto);

      await expect(registerPromise).rejects.toThrow(ConflictException);
      await expect(registerPromise).rejects.toThrow(
        'This email is already in use',
      );
    });
  });

  describe('Get Tokens', () => {
    it('should generate access and refresh tokens with configured secrets and expirations', async () => {
      jwtServiceMock.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const tokens = await (service as any).getTokens(
        '123',
        'user@example.com',
      );

      expect(jwtServiceMock.signAsync).toHaveBeenNthCalledWith(
        1,
        {
          sub: '123',
          email: 'user@example.com',
        },
        {
          secret: 'access-secret',
          expiresIn: '15m',
        },
      );
      expect(jwtServiceMock.signAsync).toHaveBeenNthCalledWith(
        2,
        {
          sub: '123',
          email: 'user@example.com',
        },
        {
          secret: 'refresh-secret',
          expiresIn: '7d',
        },
      );

      expect(tokens).toEqual({
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      });
    });

    it('should propagate signing error when access secret is missing', async () => {
      configServiceMock = AuthFactory.makeConfigServiceMock({
        JWT_ACCESS_SECRET: undefined,
      });

      service = new AuthService(
        userRepositoryMock as any,
        userServiceMock as any,
        jwtServiceMock as any,
        configServiceMock as any,
      );

      jwtServiceMock.signAsync.mockImplementation(
        (_payload: unknown, options: { secret?: string }) => {
          if (!options.secret) {
            return Promise.reject(new Error('Missing secret'));
          }

          return Promise.resolve('ok-token');
        },
      );

      await expect(
        (service as any).getTokens('123', 'user@example.com'),
      ).rejects.toThrow('Missing secret');
    });
  });
});
