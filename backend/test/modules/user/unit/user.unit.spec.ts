import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { UserFactory } from 'test/factories/user.factory';
import { ReturnUserDto } from 'src/modules/user/dto/return-user.dto';
import { SubmissionFactory } from 'test/factories/submission.factory';
import { ReturnSubmissionDto } from 'src/modules/submission/dto/return-submission.dto';

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
      useCaseMocks.findAllSubmissionsUseCase as any,
      useCaseMocks.updateUserUseCase as any,
      useCaseMocks.deleteUserUseCase as any,
      useCaseMocks.updateUserStreakOnSubmissionUseCase as any,
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
        total_submissions: userEntity.total_submissions,
        total_resolved: userEntity.total_resolved,
        streak: userEntity.streak,
        creation_date: userEntity.creation_date,
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

  describe('Get User By Email', () => {
    it('should return user entity when email matches', async () => {
      const userEntity = UserFactory.makeUserEntity();
      useCaseMocks.findOneByEmailUseCase.execute.mockResolvedValue(userEntity);

      const result = await service.findOneByEmail(userEntity.email);

      expect(result).toBeInstanceOf(ReturnUserDto);
      expect(result.id).toMatch(userEntity.id);
      expect(useCaseMocks.findOneByEmailUseCase.execute).toHaveBeenCalledWith(
        userEntity.email,
      );
      expect(result).not.toHaveProperty('password');
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

  describe('Find Submission By User Id', () => {
    it('should return a list of ReturnSubmissionDto', async () => {
      const savedEntity = SubmissionFactory.makeSubmissionEntity();
      useCaseMocks.findAllSubmissionsUseCase.execute.mockResolvedValue([
        savedEntity,
      ]);

      const id_user = '123';

      const result = await service.findAllSubmissionsById(id_user);

      expect(result.length).toBe(1);
      expect(result[0]).toBeInstanceOf(ReturnSubmissionDto);
      expect(
        useCaseMocks.findAllSubmissionsUseCase.execute,
      ).toHaveBeenCalledWith(id_user);

      expect(result[0].id).toMatch(savedEntity.id);
    });
  });

  describe('Update User', () => {
    it('should update a user and return update result', async () => {
      const userId = '123';
      const updateUserDto = {
        username: 'newusername',
        password: 'newpassword123',
      };

      const updateResult = {
        affected: 1,
        generatedMaps: [],
        raw: [],
      };

      useCaseMocks.updateUserUseCase.execute.mockResolvedValue(updateResult);

      const result = await service.update(userId, updateUserDto);

      expect(useCaseMocks.updateUserUseCase.execute).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
      expect(useCaseMocks.updateUserUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updateResult);
    });
  });

  describe('Delete User', () => {
    it('should delete a user and return delete result', async () => {
      const userId = '123';
      const deleteResult = {
        affected: 1,
        raw: [],
      };

      useCaseMocks.deleteUserUseCase.execute.mockResolvedValue(deleteResult);

      const result = await service.remove(userId);

      expect(useCaseMocks.deleteUserUseCase.execute).toHaveBeenCalledWith(
        userId,
      );
      expect(useCaseMocks.deleteUserUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(deleteResult);
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
    it('should delegate updateUserStreakOnSubmission without manager', async () => {
      const userEntity = UserFactory.makeUserEntity();

      useCaseMocks.updateUserStreakOnSubmissionUseCase.execute.mockResolvedValue(
        undefined,
      );

      await service.updateUserStreakOnSubmission(userEntity);

      expect(
        useCaseMocks.updateUserStreakOnSubmissionUseCase.execute,
      ).toHaveBeenCalledWith(userEntity, undefined);
    });

    it('should delegate updateUserStreakOnSubmission with manager', async () => {
      const userEntity = UserFactory.makeUserEntity();
      const manager = {} as any;

      useCaseMocks.updateUserStreakOnSubmissionUseCase.execute.mockResolvedValue(
        undefined,
      );

      await service.updateUserStreakOnSubmission(userEntity, manager);

      expect(
        useCaseMocks.updateUserStreakOnSubmissionUseCase.execute,
      ).toHaveBeenCalledWith(userEntity, manager);
    });
  });
});
