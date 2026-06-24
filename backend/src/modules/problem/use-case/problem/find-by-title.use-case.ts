import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Problem } from '../../entities/problem.entity';
import { ProblemRepositoryPort } from '../../interface/repository/problem.repository.port';

@Injectable()
export class FindProblemByTitleUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
  ) {}

  async execute(title: string): Promise<Problem> {
    const problem = await this.problemRepository.findByTitle(title);
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return problem;
  }
}
