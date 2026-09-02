import { Transactional } from '@nestjs-cls/transactional';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateProblemDto } from '../../dto/problem/create-problem.dto';
import { Problem } from '../../entities/problem.entity';
import { ProblemRepositoryPort } from '../../interface/repository/problem.repository.port';

@Injectable()
export class CreateProblemUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
  ) {}

  @Transactional()
  async execute(createProblemDto: CreateProblemDto): Promise<Problem> {
    if (await this.problemRepository.findByTitle(createProblemDto.title)) {
      throw new ConflictException('A problem with this title already exists');
    }

    return await this.problemRepository.createAndSave({
      ...createProblemDto,
      categories: createProblemDto.category,
      testCases: createProblemDto.testCases,
    });
  }
}
