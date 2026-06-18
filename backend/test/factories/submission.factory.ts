import { CreateSubmissionDto } from 'src/modules/submission/dto/create-submission.dto';
import { ReturnSubmissionDto } from 'src/modules/submission/dto/return-submission.dto';
import { Submission } from 'src/modules/submission/entities/submission.entity';
import { StatusEnum } from 'src/modules/submission/enum/submission-status';

export class SubmissionFactory {
  private static readonly fixedDate = new Date('2026-01-01T00:00:00.000Z');

  static makeSubmissionRepositoryMock() {
    const findOneUserAcceptedSubmission = jest.fn();
    const findLastUserSubmission = jest.fn();
    const save = jest.fn();
    const findAll = jest.fn();
    const findOneById = jest.fn();
    const findAllByUserId = jest.fn();
    const updateById = jest.fn();
    const remove = jest.fn();

    return {
      findOneUserAcceptedSubmission,
      findLastUserSubmission,
      save,
      findAll,
      findOneById,
      findAllByUserId,
      updateById,
      remove,
    };
  }

  static makeSubmissionUseCaseMocks() {
    const createSubmissionUseCase = { execute: jest.fn() };
    const createPlaygroundSubmissionUseCase = { execute: jest.fn() };
    const findAllSubmissionUseCase = { execute: jest.fn() };
    const findOneSubmissionByIdUseCase = { execute: jest.fn() };
    const findAllSubmissionByUserIdUseCase = { execute: jest.fn() };
    const updateSubmissionUseCase = { execute: jest.fn() };
    const deleteSubmissionUseCase = { execute: jest.fn() };

    return {
      createSubmissionUseCase,
      createPlaygroundSubmissionUseCase,
      findAllSubmissionUseCase,
      findOneSubmissionByIdUseCase,
      findAllSubmissionByUserIdUseCase,
      updateSubmissionUseCase,
      deleteSubmissionUseCase,
    };
  }

  static makeCreateSubmissionDto(): CreateSubmissionDto {
    return new CreateSubmissionDto('123', 1, 'print("Hello World!")', 'python');
  }

  static makeSubmissionEntity(): Submission {
    return new Submission(
      '123',
      '123',
      1,
      'print("Hello World!")',
      'python',
      StatusEnum.ACCEPTED,
      0,
      new Date(this.fixedDate.getDate()),
      null,
      0,
      3,
    );
  }

  static makeReturnSubmissionDto(): ReturnSubmissionDto {
    return ReturnSubmissionDto.fromEntity(this.makeSubmissionEntity());
  }
}
