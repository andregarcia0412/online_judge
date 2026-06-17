import { Inject, Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { UpdateProblemDto } from '../../dto/problem/update-problem.dto';
import { ProblemRepositoryPort } from '../../interface/problem.repository.port';

@Injectable()
export class UpdateProblemUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
  ) {}

  async execute(
    id: number,
    updateProblemDto: UpdateProblemDto,
  ): Promise<UpdateResult> {
    return await this.problemRepository.updateById(id, updateProblemDto);
  }
}
