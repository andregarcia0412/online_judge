import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProblemDto } from '../../dto/problem/update-problem.dto';
import { Problem } from '../../entities/problem.entity';
import { ProblemRepositoryPort } from '../../interface/repository/problem.repository.port';

@Injectable()
export class UpdateProblemUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
  ) {}

  async execute(
    id: number,
    updateProblemDto: UpdateProblemDto,
  ): Promise<Problem> {
    const problem = await this.problemRepository.updateById(
      id,
      updateProblemDto,
    );

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return problem;
  }
}
