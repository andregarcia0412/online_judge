import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Problem } from '../../entities/problem.entity';
import { ProblemRepositoryPort } from '../../interface/repository/problem.repository.port';

@Injectable()
export class FindProblemByIdUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
  ) {}

  async execute(id: number): Promise<Problem> {
    const problem = await this.problemRepository.findById(id);
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return problem;
  }
}
