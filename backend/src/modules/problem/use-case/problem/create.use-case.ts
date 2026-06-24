import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateProblemDto } from '../../dto/problem/create-problem.dto';
import { Problem } from '../../entities/problem.entity';
import { ProblemRepositoryPort } from '../../interface/repository/problem.repository.port';

@Injectable()
export class CreateProblemUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
    private readonly dataSource: DataSource,
  ) {}

  async execute(createProblemDto: CreateProblemDto): Promise<Problem> {
    return await this.dataSource.transaction(async (manager) => {
      if (
        await this.problemRepository.findByTitle(
          createProblemDto.title,
          manager,
        )
      ) {
        throw new ConflictException('A problem with this title already exists');
      }

      return await this.problemRepository.createAndSave(
        {
          ...createProblemDto,
          categories: createProblemDto.category,
          testCases: createProblemDto.testCases,
        },
        manager,
      );
    });
  }
}
