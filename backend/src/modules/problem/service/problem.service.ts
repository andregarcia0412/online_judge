import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteResult, UpdateResult } from 'typeorm/browser';
import { ReturnTestCaseDto } from '../../test-case/dto/return-test-case.dto';
import { TestCase } from '../../test-case/entities/test-case.entity';
import { CreateProblemDto } from '../dto/problem/create-problem.dto';
import { ReturnProblemDto } from '../dto/problem/return-problem.dto';
import { UpdateProblemDto } from '../dto/problem/update-problem.dto';
import { Problem } from '../entities/problem.entity';
import { CategoryService } from './category.service';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createProblemDto: CreateProblemDto): Promise<ReturnProblemDto> {
    if (
      await this.problemRepository.findOneBy({ title: createProblemDto.title })
    ) {
      throw new ConflictException('A problem with this title already exists');
    }
    const newProblem = this.problemRepository.create(createProblemDto);
    return ReturnProblemDto.fromEntity(
      await this.problemRepository.save(newProblem),
    );
  }

  async findAll(): Promise<ReturnProblemDto[]> {
    const problems = await this.problemRepository.find({
      order: {
        id: 'ASC',
      },
    });

    return await Promise.all(
      problems.map(async (problem: Problem) => {
        const categories = await this.categoryService.findCategoriesByProblemId(
          problem.id,
        );
        return ReturnProblemDto.fromEntity(problem, categories);
      }),
    );
  }

  async findOneById(id: number): Promise<ReturnProblemDto> {
    const problem = await this.problemRepository.findOneBy({ id });
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    const categories = await this.categoryService.findCategoriesByProblemId(
      problem.id,
    );

    return ReturnProblemDto.fromEntity(problem, categories);
  }

  async findOneByTitle(title: string): Promise<ReturnProblemDto> {
    const problem = await this.problemRepository.findOneBy({ title });
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    const categories = await this.categoryService.findCategoriesByProblemId(
      problem.id,
    );

    return ReturnProblemDto.fromEntity(problem, categories);
  }

  async findAllTestCasesById(id: number): Promise<ReturnTestCaseDto[]> {
    return (await this.testCaseRepository.findBy({ id_problem: id })).map(
      (testCase: TestCase) => ReturnTestCaseDto.fromEntity(testCase),
    );
  }

  async update(
    id: number,
    updateProblemDto: UpdateProblemDto,
  ): Promise<UpdateResult> {
    return await this.problemRepository.update(id, updateProblemDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.testCaseRepository.delete({ id_problem: id });
    await this.categoryService.removeByProblemId(id);
    return await this.problemRepository.delete(id);
  }
}
