import { Module } from '@nestjs/common';
import { TestCaseService } from './test-case.service';
import { TestCaseController } from './test-case.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCase } from './entities/test-case.entity';
import { ProblemModule } from 'src/problem/problem.module';

@Module({
  imports: [TypeOrmModule.forFeature([TestCase]), ProblemModule],
  controllers: [TestCaseController],
  providers: [TestCaseService],
})
export class TestCaseModule {}
