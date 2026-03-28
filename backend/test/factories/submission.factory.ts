import { CreateSubmissionDto } from 'src/modules/submission/dto/create-submission.dto';
import { ReturnSubmissionDto } from 'src/modules/submission/dto/return-submission.dto';
import { Submission } from 'src/modules/submission/entities/submission.entity';
import { StatusEnum } from 'src/modules/submission/enum/submission-status';

export class SubmissionFactory {
  private static readonly fixedDate = new Date('2026-01-01T00:00:00.000Z');

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
