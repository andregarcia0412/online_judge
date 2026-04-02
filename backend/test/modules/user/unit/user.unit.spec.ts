import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { UserFactory } from 'test/factories/user.factory';
import { ReturnUserDto } from 'src/modules/user/dto/return-user.dto';
import { SubmissionFactory } from 'test/factories/submission.factory';
import { ReturnSubmissionDto } from 'src/modules/submission/dto/return-submission.dto';

describe('UserService', () => {
  let userRepositoryMock: ReturnType<typeof UserFactory.makeUserRepositoryMock>;
  let submissionRepositoryMock: ReturnType<
    typeof SubmissionFactory.makeSubmissionRepositoryMock
  >;
  let service: UserService;

  beforeEach(() => {
    userRepositoryMock = UserFactory.makeUserRepositoryMock();
    submissionRepositoryMock = SubmissionFactory.makeSubmissionRepositoryMock();

    service = new UserService(
      userRepositoryMock as any,
      submissionRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('Create User', () => {
    it('should create a user with hashed password', async () => {
      const userRepositoryMock = UserFactory.makeUserRepositoryMock();

      const submissionRepositoryMock =
        SubmissionFactory.makeSubmissionRepositoryMock();

      const service = new UserService(
        userRepositoryMock as any,
        submissionRepositoryMock as any,
      );

      const createUserDto = UserFactory.makeCreateUserDto();

      userRepositoryMock.findOneBy
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      userRepositoryMock.save.mockResolvedValue(UserFactory.makeUserEntity());

      const result = await service.create({ ...createUserDto });

      expect(userRepositoryMock.findOneBy).toHaveBeenNthCalledWith(1, {
        email: createUserDto.email,
      });

      expect(userRepositoryMock.findOneBy).toHaveBeenNthCalledWith(2, {
        username: createUserDto.username,
      });

      const savedPayload = userRepositoryMock.save.mock.calls[0][0];
      expect(savedPayload.password).not.toBe(createUserDto.password);
      expect(
        await bcrypt.compare(createUserDto.password, savedPayload.password),
      ).toBe(true);

      expect(result).toMatchObject(UserFactory.makeReturnUserDto());

      expect(result).not.toHaveProperty('password');
    });

    it('should return conflict exception when user email is already in use', async () => {
      const userRepositoryMock = UserFactory.makeUserRepositoryMock();

      const submissionRepositoryMock =
        SubmissionFactory.makeSubmissionRepositoryMock();

      const service = new UserService(
        userRepositoryMock as any,
        submissionRepositoryMock as any,
      );

      const createUserDto = UserFactory.makeCreateUserDto();

      const foundUser = UserFactory.makeUserEntity();

      userRepositoryMock.findOneBy.mockResolvedValueOnce(foundUser);

      const createPromise = service.create({ ...createUserDto });

      await expect(createPromise).rejects.toThrow(ConflictException);
      await expect(createPromise).rejects.toThrow(
        'This email is already in use',
      );

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should return conflict exception when username is already in use', async () => {
      const userRepositoryMock = UserFactory.makeUserRepositoryMock();

      const submissionRepositoryMock =
        SubmissionFactory.makeSubmissionRepositoryMock();

      const service = new UserService(
        userRepositoryMock as any,
        submissionRepositoryMock as any,
      );

      const createUserDto = UserFactory.makeCreateUserDto();

      const foundUser = UserFactory.makeUserEntity();

      userRepositoryMock.findOneBy
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(foundUser);

      const createPromise = service.create({ ...createUserDto });

      await expect(createPromise).rejects.toThrow(ConflictException);
      await expect(createPromise).rejects.toThrow(
        'This username is already in use',
      );

      expect(userRepositoryMock.findOneBy).toHaveBeenNthCalledWith(2, {
        username: createUserDto.username,
      });
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('Get All User', () => {
    it('should return a list of ReturnUserDto', async () => {
      const userRepositoryMock = UserFactory.makeUserRepositoryMock();
      const submissionRepositoryMock =
        SubmissionFactory.makeSubmissionRepositoryMock();

      const userEntity = UserFactory.makeUserEntity();
      userRepositoryMock.find.mockResolvedValue([userEntity]);

      const service = new UserService(
        userRepositoryMock as any,
        submissionRepositoryMock as any,
      );

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ReturnUserDto);
      expect(userRepositoryMock.find).toHaveBeenCalled();

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
      const userRepositoryMock = UserFactory.makeUserRepositoryMock();
      const submissionRepositoryMock =
        SubmissionFactory.makeSubmissionRepositoryMock();

      const userEntity = UserFactory.makeUserEntity();
      userRepositoryMock.findOneBy.mockResolvedValue(userEntity);

      const service = new UserService(
        userRepositoryMock as any,
        submissionRepositoryMock as any,
      );

      const updateUserStreakSpy = jest
        .spyOn(service, 'updateUserStreak')
        .mockResolvedValue(undefined);

      const result = await service.findOneById(userEntity.id);

      expect(result).toBeInstanceOf(ReturnUserDto);
      expect(result.email).toMatch(userEntity.email);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: userEntity.id,
      });
      expect(result).not.toHaveProperty('password');
      expect(updateUserStreakSpy).toHaveBeenCalled();
    });

    it('should throw not found exception when id does not match', async () => {
      const userRepositoryMock = UserFactory.makeUserRepositoryMock();
      const submissionRepositoryMock =
        SubmissionFactory.makeSubmissionRepositoryMock();

      userRepositoryMock.findOneBy.mockResolvedValue(null);

      const service = new UserService(
        userRepositoryMock as any,
        submissionRepositoryMock as any,
      );

      const getPromise = service.findOneById('123');

      await expect(getPromise).rejects.toThrow(NotFoundException);
      await expect(getPromise).rejects.toThrow('User not found');
    });
  });

  describe('Get User By Email', () => {
    it('should return user entity when email matches', async () => {
      const userRepositoryMock = UserFactory.makeUserRepositoryMock();
      const submissionRepositoryMock =
        SubmissionFactory.makeSubmissionRepositoryMock();

      const userEntity = UserFactory.makeUserEntity();
      userRepositoryMock.findOneBy.mockResolvedValue(userEntity);

      const service = new UserService(
        userRepositoryMock as any,
        submissionRepositoryMock as any,
      );

      const result = await service.findOneByEmail(userEntity.email);

      expect(result).toBeInstanceOf(ReturnUserDto);
      expect(result.id).toMatch(userEntity.id);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: userEntity.email,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw not found exception when email does not matches', async () => {
      const userRepositoryMock = UserFactory.makeUserRepositoryMock();
      const submissionRepositoryMock =
        SubmissionFactory.makeSubmissionRepositoryMock();

      userRepositoryMock.findOneBy.mockResolvedValue(null);

      const service = new UserService(
        userRepositoryMock as any,
        submissionRepositoryMock as any,
      );

      const getPromise = service.findOneByEmail('user@example');

      await expect(getPromise).rejects.toThrow(NotFoundException);
      await expect(getPromise).rejects.toThrow('User not found');
    });
  });

  describe('Find Submission By User Id', () => {
    it('should return a list of ReturnSubmissionDto', async () => {
      const userRepositoryMock = UserFactory.makeUserRepositoryMock();
      const submissionRepositoryMock =
        SubmissionFactory.makeSubmissionRepositoryMock();

      const savedEntity = SubmissionFactory.makeSubmissionEntity();
      submissionRepositoryMock.findBy.mockResolvedValue([savedEntity]);

      const service = new UserService(
        userRepositoryMock as any,
        submissionRepositoryMock as any,
      );

      const id_user = '123';

      const result = await service.findAllSubmissionsById(id_user);

      expect(result.length).toBe(1);
      expect(result[0]).toBeInstanceOf(ReturnSubmissionDto);
      expect(submissionRepositoryMock.findBy).toHaveBeenCalledWith({
        id_user,
      });

      expect(result[0].id).toMatch(savedEntity.id);
    });
  });

  describe('Update User', () => {
    it('should update a user and return update result', async () => {
      const userRepositoryMock = UserFactory.makeUserRepositoryMock();
      const submissionRepositoryMock =
        SubmissionFactory.makeSubmissionRepositoryMock();

      const service = new UserService(
        userRepositoryMock as any,
        submissionRepositoryMock as any,
      );

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

      userRepositoryMock.update.mockResolvedValue(updateResult);

      const result = await service.update(userId, updateUserDto);

      expect(userRepositoryMock.update).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
      expect(userRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updateResult);
    });
  });

  describe('Delete User', () => {
    it('should delete a user and return delete result', async () => {
      const userRepositoryMock = UserFactory.makeUserRepositoryMock();
      const submissionRepositoryMock =
        SubmissionFactory.makeSubmissionRepositoryMock();

      const service = new UserService(
        userRepositoryMock as any,
        submissionRepositoryMock as any,
      );

      const userId = '123';
      const deleteResult = {
        affected: 1,
        raw: [],
      };

      userRepositoryMock.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(userId);

      expect(userRepositoryMock.delete).toHaveBeenCalledWith(userId);
      expect(userRepositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual(deleteResult);
    });
  });
});
