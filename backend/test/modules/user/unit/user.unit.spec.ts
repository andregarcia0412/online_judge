import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { UserFactory } from 'test/factories/user.factory';
import { ReturnAvatarDto } from 'src/modules/user/dto/return-avatar.dto';
import { ReturnUserDto } from 'src/modules/user/dto/return-user.dto';
import { User } from 'src/modules/user/entities/user.entity';

describe('UserService', () => {
  let useCaseMocks: ReturnType<typeof UserFactory.makeUserUseCaseMocks>;
  let service: UserService;

  beforeEach(() => {
    useCaseMocks = UserFactory.makeUserUseCaseMocks();

    service = new UserService(
      useCaseMocks.createUserUseCase as any,
      useCaseMocks.findAllUseCase as any,
      useCaseMocks.findOneUserByIdUseCase as any,
      useCaseMocks.updateUserStreakUseCase as any,
      useCaseMocks.findOneByEmailUseCase as any,
      useCaseMocks.updateUserUseCase as any,
      useCaseMocks.deleteUserUseCase as any,
      useCaseMocks.updateUserStreakOnSubmissionUseCase as any,
      useCaseMocks.getAvatarUseCase as any,
      useCaseMocks.putAvatarUseCase as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('Create User', () => {
    it('should delegate creation and return ReturnUserDto', async () => {
      const createUserDto = UserFactory.makeCreateUserDto();
      const userEntity = UserFactory.makeUserEntity();

      useCaseMocks.createUserUseCase.execute.mockResolvedValue(userEntity);

      const result = await service.create({ ...createUserDto });

      expect(useCaseMocks.createUserUseCase.execute).toHaveBeenCalledWith(
        createUserDto,
      );
      expect(result).toBeInstanceOf(ReturnUserDto);
      expect(result).toMatchObject(UserFactory.makeReturnUserDto());
      expect(result).not.toHaveProperty('password');
    });

    it('should propagate conflict exception when user email is already in use', async () => {
      const createUserDto = UserFactory.makeCreateUserDto();

      useCaseMocks.createUserUseCase.execute.mockRejectedValue(
        new ConflictException('This email is already in use'),
      );

      const createPromise = service.create({ ...createUserDto });

      await expect(createPromise).rejects.toThrow(ConflictException);
      await expect(createPromise).rejects.toThrow(
        'This email is already in use',
      );

      expect(useCaseMocks.createUserUseCase.execute).toHaveBeenCalledWith(
        createUserDto,
      );
    });

    it('should propagate conflict exception when username is already in use', async () => {
      const createUserDto = UserFactory.makeCreateUserDto();

      useCaseMocks.createUserUseCase.execute.mockRejectedValue(
        new ConflictException('This username is already in use'),
      );

      const createPromise = service.create({ ...createUserDto });

      await expect(createPromise).rejects.toThrow(ConflictException);
      await expect(createPromise).rejects.toThrow(
        'This username is already in use',
      );

      expect(useCaseMocks.createUserUseCase.execute).toHaveBeenCalledWith(
        createUserDto,
      );
    });
  });

  describe('Get All User', () => {
    it('should return a list of ReturnUserDto', async () => {
      const userEntity = UserFactory.makeUserEntity();
      useCaseMocks.findAllUseCase.execute.mockResolvedValue([userEntity]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ReturnUserDto);
      expect(useCaseMocks.findAllUseCase.execute).toHaveBeenCalled();

      expect(result[0]).toMatchObject({
        id: userEntity.id,
        email: userEntity.email,
        username: userEntity.username,
        points: userEntity.points,
        totalSubmissions: userEntity.totalSubmissions,
        totalResolved: userEntity.totalResolved,
        streak: userEntity.streak,
        createdAt: userEntity.createdAt,
      });

      expect(result[0]).not.toHaveProperty('password');
    });
  });

  describe('Get User By Id', () => {
    it('should return user entity and check user streak when id matches', async () => {
      const userEntity = UserFactory.makeUserEntity();
      useCaseMocks.findOneUserByIdUseCase.execute.mockResolvedValue(userEntity);
      useCaseMocks.updateUserStreakUseCase.execute.mockResolvedValue(undefined);

      const result = await service.findOneById(userEntity.id);

      expect(result).toBeInstanceOf(ReturnUserDto);
      expect(result.email).toMatch(userEntity.email);
      expect(useCaseMocks.findOneUserByIdUseCase.execute).toHaveBeenCalledWith(
        userEntity.id,
      );
      expect(result).not.toHaveProperty('password');
      expect(useCaseMocks.updateUserStreakUseCase.execute).toHaveBeenCalledWith(
        userEntity,
      );
    });

    it('should throw not found exception when id does not match', async () => {
      useCaseMocks.findOneUserByIdUseCase.execute.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      const getPromise = service.findOneById('123');

      await expect(getPromise).rejects.toThrow(NotFoundException);
      await expect(getPromise).rejects.toThrow('User not found');
      expect(
        useCaseMocks.updateUserStreakUseCase.execute,
      ).not.toHaveBeenCalled();
    });
  });

  describe('Get User Entity By Id', () => {
    it('should delegate to FindOneUserByIdUseCase and return the raw entity without touching the streak', async () => {
      const userEntity = UserFactory.makeUserEntity();
      useCaseMocks.findOneUserByIdUseCase.execute.mockResolvedValue(userEntity);

      const result = await service.findUserEntityById(userEntity.id);

      expect(result).toBeInstanceOf(User);
      expect(result).toBe(userEntity);
      expect(useCaseMocks.findOneUserByIdUseCase.execute).toHaveBeenCalledWith(
        userEntity.id,
      );
      expect(
        useCaseMocks.updateUserStreakUseCase.execute,
      ).not.toHaveBeenCalled();
    });

    it('should propagate not found exception when id does not match', async () => {
      useCaseMocks.findOneUserByIdUseCase.execute.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      const getPromise = service.findUserEntityById('123');

      await expect(getPromise).rejects.toThrow(NotFoundException);
      await expect(getPromise).rejects.toThrow('User not found');
    });
  });

  describe('Get User By Email', () => {
    it('should return user entity when email matches', async () => {
      const userEntity = UserFactory.makeUserEntity();
      useCaseMocks.findOneByEmailUseCase.execute.mockResolvedValue(userEntity);

      const result = await service.findOneByEmail(userEntity.email);

      expect(result).toBeInstanceOf(User);
      expect(result).toBe(userEntity);
      expect(result!.id).toMatch(userEntity.id);
      expect(useCaseMocks.findOneByEmailUseCase.execute).toHaveBeenCalledWith(
        userEntity.email,
      );
    });

    it('should throw not found exception when email does not matches', async () => {
      useCaseMocks.findOneByEmailUseCase.execute.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      const getPromise = service.findOneByEmail('user@example');

      await expect(getPromise).rejects.toThrow(NotFoundException);
      await expect(getPromise).rejects.toThrow('User not found');
    });
  });

  describe('Update User', () => {
    it('should update a user and return ReturnUserDto', async () => {
      const userId = '123';
      const updateUserDto = {
        username: 'newusername',
        password: 'newpassword123',
      };

      const updatedUser = UserFactory.makeUserEntity();

      useCaseMocks.updateUserUseCase.execute.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(useCaseMocks.updateUserUseCase.execute).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
      expect(useCaseMocks.updateUserUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(ReturnUserDto);
      expect(result).toMatchObject(UserFactory.makeReturnUserDto());
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('Delete User', () => {
    it('should delegate deletion to the use case', async () => {
      const userId = '123';

      useCaseMocks.deleteUserUseCase.execute.mockResolvedValue(undefined);

      const result = await service.remove(userId);

      expect(useCaseMocks.deleteUserUseCase.execute).toHaveBeenCalledWith(
        userId,
      );
      expect(useCaseMocks.deleteUserUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });

  describe('Update User Streak', () => {
    it('should delegate updateUserStreak to use-case', async () => {
      const userEntity = UserFactory.makeUserEntity();

      useCaseMocks.updateUserStreakUseCase.execute.mockResolvedValue(undefined);

      await service.updateUserStreak(userEntity);

      expect(useCaseMocks.updateUserStreakUseCase.execute).toHaveBeenCalledWith(
        userEntity,
      );
    });
  });

  describe('Update User Streak On Submission', () => {
    it('should delegate updateUserStreakOnSubmission to the use case', () => {
      const userEntity = UserFactory.makeUserEntity();

      service.updateUserStreakOnSubmission(userEntity);

      expect(
        useCaseMocks.updateUserStreakOnSubmissionUseCase.execute,
      ).toHaveBeenCalledWith(userEntity);
    });
  });

  describe('Get User Avatar', () => {
    it('should delegate to GetAvatarUseCase and wrap the url in ReturnAvatarDto', async () => {
      const userId = '123';
      const avatarUrl = 'https://bucket.s3.amazonaws.com/users/123/avatar.png';

      useCaseMocks.getAvatarUseCase.execute.mockResolvedValue(avatarUrl);

      const result = await service.getUserAvatar(userId);

      expect(useCaseMocks.getAvatarUseCase.execute).toHaveBeenCalledWith(
        userId,
      );
      expect(useCaseMocks.getAvatarUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(ReturnAvatarDto);
      expect(result.avatarUrl).toBe(avatarUrl);
    });

    it('should return a null url when the user has no avatar', async () => {
      const userId = '123';

      useCaseMocks.getAvatarUseCase.execute.mockResolvedValue(null);

      const result = await service.getUserAvatar(userId);

      expect(result).toBeInstanceOf(ReturnAvatarDto);
      expect(result.avatarUrl).toBeNull();
    });

    it('should propagate not found exception when id does not match', async () => {
      const userId = '123';

      useCaseMocks.getAvatarUseCase.execute.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      const getPromise = service.getUserAvatar(userId);

      await expect(getPromise).rejects.toThrow(NotFoundException);
      await expect(getPromise).rejects.toThrow('User not found');
    });
  });

  describe('Create User Avatar', () => {
    it('should delegate to PutAvatarUseCase and wrap the url in ReturnAvatarDto', async () => {
      const userId = '123';
      const file = UserFactory.makeAvatarFile();
      const avatarUrl = 'https://bucket.s3.amazonaws.com/users/123/avatar.png';

      useCaseMocks.putAvatarUseCase.execute.mockResolvedValue(avatarUrl);

      const result = await service.createUserAvatar(userId, file);

      expect(useCaseMocks.putAvatarUseCase.execute).toHaveBeenCalledWith(
        userId,
        file,
      );
      expect(useCaseMocks.putAvatarUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(ReturnAvatarDto);
      expect(result.avatarUrl).toBe(avatarUrl);
    });

    it('should propagate bad request exception when the mimetype is unsupported', async () => {
      const userId = '123';
      const file = UserFactory.makeAvatarFile();

      useCaseMocks.putAvatarUseCase.execute.mockRejectedValue(
        new BadRequestException('Unsupported Mimetype'),
      );

      const createPromise = service.createUserAvatar(userId, file);

      await expect(createPromise).rejects.toThrow(BadRequestException);
      await expect(createPromise).rejects.toThrow('Unsupported Mimetype');
    });
  });
});
