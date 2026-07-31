import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthResponseDto } from 'src/modules/auth/dto/auth-response.dto';
import { AuthFactory } from 'test/factories/auth.factory';
import { UserFactory } from 'test/factories/user.factory';

describe('AuthService', () => {
  let hashProviderMock: ReturnType<typeof AuthFactory.makeHashProviderMock>;
  let userServiceMock: ReturnType<typeof AuthFactory.makeUserServiceMock>;
  let jwtProviderMock: ReturnType<typeof AuthFactory.makeJwtProviderMock>;
  let emailSenderProviderMock: ReturnType<
    typeof AuthFactory.makeEmailSenderProviderMock
  >;
  let useCaseMocks: ReturnType<
    typeof AuthFactory.makePasswordResetUseCaseMocks
  >;
  let cacheProviderMock: ReturnType<typeof AuthFactory.makeCacheProviderMock>;
  let configServiceMock: ReturnType<typeof AuthFactory.makeConfigServiceMock>;
  let service: AuthService;

  beforeEach(() => {
    hashProviderMock = AuthFactory.makeHashProviderMock();
    userServiceMock = AuthFactory.makeUserServiceMock();
    jwtProviderMock = AuthFactory.makeJwtProviderMock();
    emailSenderProviderMock = AuthFactory.makeEmailSenderProviderMock();
    useCaseMocks = AuthFactory.makePasswordResetUseCaseMocks();
    cacheProviderMock = AuthFactory.makeCacheProviderMock();
    configServiceMock = AuthFactory.makeConfigServiceMock();

    service = new AuthService(
      hashProviderMock as any,
      userServiceMock as any,
      jwtProviderMock as any,
      emailSenderProviderMock as any,
      useCaseMocks.findActivePasswordResetCodeUseCase as any,
      useCaseMocks.generatePasswordResetCodeUseCase as any,
      useCaseMocks.incrementAttemptsUseCase as any,
      useCaseMocks.invalidateAllUseCase as any,
      useCaseMocks.markAsUsedUseCase as any,
      useCaseMocks.validateCodeUseCase as any,
      cacheProviderMock as any,
      configServiceMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Login', () => {
    it('should return AuthResponseDto when email and password are valid', async () => {
      const user = AuthFactory.makeAuthUserEntity({ password: 'hashed-pass' });
      const loginDto = AuthFactory.makeLoginDto(user.email, '123123123');

      userServiceMock.findOneByEmail.mockResolvedValue(user);
      hashProviderMock.compare.mockResolvedValue(true);
      jwtProviderMock.generateAccessToken.mockReturnValue('access-token');
      jwtProviderMock.generateRefreshToken.mockReturnValue('refresh-token');

      const result = await service.login(loginDto);

      expect(userServiceMock.findOneByEmail).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(hashProviderMock.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(userServiceMock.updateUserStreak).toHaveBeenCalledWith(user);
      expect(jwtProviderMock.generateAccessToken).toHaveBeenCalledWith(user.id);
      expect(jwtProviderMock.generateRefreshToken).toHaveBeenCalledWith(
        user.id,
      );

      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(result).toMatchObject({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      const loginDto = AuthFactory.makeLoginDto();
      userServiceMock.findOneByEmail.mockResolvedValue(null);

      const loginPromise = service.login(loginDto);

      await expect(loginPromise).rejects.toThrow(UnauthorizedException);
      await expect(loginPromise).rejects.toThrow('Incorrect email or password');
      expect(hashProviderMock.compare).not.toHaveBeenCalled();
      expect(jwtProviderMock.generateAccessToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password does not match', async () => {
      const user = AuthFactory.makeAuthUserEntity({ password: 'hashed-pass' });
      const loginDto = AuthFactory.makeLoginDto(user.email, '123123123');

      userServiceMock.findOneByEmail.mockResolvedValue(user);
      hashProviderMock.compare.mockResolvedValue(false);

      const loginPromise = service.login(loginDto);

      await expect(loginPromise).rejects.toThrow(UnauthorizedException);
      await expect(loginPromise).rejects.toThrow('Incorrect email or password');
      expect(hashProviderMock.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(userServiceMock.updateUserStreak).not.toHaveBeenCalled();
      expect(jwtProviderMock.generateAccessToken).not.toHaveBeenCalled();
    });

    it('should propagate error when hash comparison fails', async () => {
      const user = AuthFactory.makeAuthUserEntity({ password: 'hashed-pass' });
      const loginDto = AuthFactory.makeLoginDto(user.email, '123123123');

      userServiceMock.findOneByEmail.mockResolvedValue(user);
      hashProviderMock.compare.mockRejectedValue(new Error('compare failed'));

      await expect(service.login(loginDto)).rejects.toThrow('compare failed');
      expect(jwtProviderMock.generateAccessToken).not.toHaveBeenCalled();
    });
  });

  describe('Refresh', () => {
    it('should return AuthResponseDto when refresh token is valid', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00.000Z'));

      const refreshTokenDto = AuthFactory.makeRefreshTokenDto();
      const payload = AuthFactory.makeTokenPayload({ sub: '123' });

      jwtProviderMock.verifyRefreshToken.mockReturnValue(payload);
      jwtProviderMock.generateAccessToken.mockReturnValue('new-access-token');
      jwtProviderMock.generateRefreshToken.mockReturnValue('new-refresh-token');

      const result = await service.refresh(refreshTokenDto);

      expect(jwtProviderMock.verifyRefreshToken).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
      );
      expect(cacheProviderMock.get).toHaveBeenCalledWith(
        `blacklist:${refreshTokenDto.refreshToken}`,
      );
      expect(cacheProviderMock.set).toHaveBeenCalledWith(
        `blacklist:${refreshTokenDto.refreshToken}`,
        true,
        payload.exp - Math.floor(Date.now() / 1000),
      );
      expect(userServiceMock.findOneById).toHaveBeenCalledWith(payload.sub);
      expect(jwtProviderMock.generateAccessToken).toHaveBeenCalledWith(
        payload.sub,
      );
      expect(jwtProviderMock.generateRefreshToken).toHaveBeenCalledWith(
        payload.sub,
      );
      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(result).toMatchObject({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      jest.useRealTimers();
    });

    it('should throw UnauthorizedException when the refresh token is blacklisted', async () => {
      const refreshTokenDto = AuthFactory.makeRefreshTokenDto();

      jwtProviderMock.verifyRefreshToken.mockReturnValue(
        AuthFactory.makeTokenPayload(),
      );
      cacheProviderMock.get.mockResolvedValue(true);

      const refreshPromise = service.refresh(refreshTokenDto);

      await expect(refreshPromise).rejects.toThrow(UnauthorizedException);
      await expect(refreshPromise).rejects.toThrow(
        'Invalid or expired refresh token',
      );
      expect(cacheProviderMock.set).not.toHaveBeenCalled();
      expect(jwtProviderMock.generateAccessToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when the user no longer exists', async () => {
      const refreshTokenDto = AuthFactory.makeRefreshTokenDto();

      jwtProviderMock.verifyRefreshToken.mockReturnValue(
        AuthFactory.makeTokenPayload(),
      );
      userServiceMock.findOneById.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(service.refresh(refreshTokenDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwtProviderMock.generateAccessToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token payload has no subject', async () => {
      const refreshTokenDto = AuthFactory.makeRefreshTokenDto();

      jwtProviderMock.verifyRefreshToken.mockReturnValue({ sub: undefined });

      const refreshPromise = service.refresh(refreshTokenDto);

      await expect(refreshPromise).rejects.toThrow(UnauthorizedException);
      await expect(refreshPromise).rejects.toThrow(
        'Invalid or expired refresh token',
      );
      expect(cacheProviderMock.get).not.toHaveBeenCalled();
      expect(jwtProviderMock.generateAccessToken).not.toHaveBeenCalled();
    });

    it('should propagate error when refresh token verification fails', async () => {
      const refreshTokenDto = AuthFactory.makeRefreshTokenDto('invalid-token');

      jwtProviderMock.verifyRefreshToken.mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      await expect(service.refresh(refreshTokenDto)).rejects.toThrow(
        'jwt malformed',
      );
      expect(jwtProviderMock.generateAccessToken).not.toHaveBeenCalled();
    });
  });

  describe('Register', () => {
    it('should create the user and return AuthResponseDto', async () => {
      const createUserDto = AuthFactory.makeCreateUserDto();
      const createdUser = UserFactory.makeReturnUserDto();

      userServiceMock.create.mockResolvedValue(createdUser);
      jwtProviderMock.generateAccessToken.mockReturnValue('access-token');
      jwtProviderMock.generateRefreshToken.mockReturnValue('refresh-token');

      const result = await service.register(createUserDto);

      expect(userServiceMock.create).toHaveBeenCalledWith(createUserDto);
      expect(jwtProviderMock.generateAccessToken).toHaveBeenCalledWith(
        createdUser.id,
      );
      expect(jwtProviderMock.generateRefreshToken).toHaveBeenCalledWith(
        createdUser.id,
      );
      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(result).toMatchObject({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
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
});
