import { Inject, Injectable } from '@nestjs/common';
import { Problem } from '../../entities/problem.entity';
import { ProblemRepositoryPort } from '../../interface/repository/problem.repository.port';

@Injectable()
export class FindAllProblemUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
  ) {}

  async execute(): Promise<Problem[]> {
    return await this.problemRepository.findAllOrdered();
  }
}
