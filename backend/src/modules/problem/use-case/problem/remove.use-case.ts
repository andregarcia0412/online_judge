import { Inject, Injectable } from '@nestjs/common';
import { ProblemRepositoryPort } from '../../interface/repository/problem.repository.port';

@Injectable()
export class RemoveProblemUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    await this.problemRepository.delete(id);
  }
}
