import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private problemRepository: Repository<Problem>,
  ) {}

  async create(createProblemDto: CreateProblemDto) {
    if (await this.findOneByNumber(createProblemDto.number)) {
      throw new ConflictException('This number is already in use');
    }

    const newProblem = this.problemRepository.create(createProblemDto);
    return this.problemRepository.save(newProblem);
  }

  findAll() {
    return this.problemRepository.find();
  }

  findOneById(id: number) {
    return this.problemRepository.findOneBy({ id });
  }

  findOneByTitle(title: string) {
    return this.problemRepository.findOneBy({ title });
  }

  findOneByNumber(number: number) {
    return this.problemRepository.findOneBy({ number });
  }

  update(id: number, updateProblemDto: UpdateProblemDto) {
    return this.problemRepository.update(id, updateProblemDto);
  }

  remove(id: number) {
    return this.problemRepository.delete(id);
  }
}
