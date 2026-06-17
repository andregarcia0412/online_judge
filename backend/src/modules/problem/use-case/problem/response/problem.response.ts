import { Category } from 'src/modules/problem/entities/category.entity';
import { Problem } from 'src/modules/problem/entities/problem.entity';
import { TestCase } from 'src/modules/problem/entities/test-case.entity';

export class ProblemResponse {
  constructor(problem: Problem, testCases: TestCase[], categories: Category[]) {
    this.problem = problem;
    this.testCases = testCases;
    this.categories = categories;
  }

  problem: Problem;
  testCases: TestCase[];
  categories: Category[];
}
