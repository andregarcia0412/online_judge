import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from '../problem/entities/problem.entity';
import { TestCase } from './entities/test-case.entity';
import { TestCaseController } from './test-case.controller';
import { TestCaseService } from './test-case.service';

@Module({
  imports: [TypeOrmModule.forFeature([TestCase, Problem])],
  controllers: [TestCaseController],
  providers: [TestCaseService],
  exports: [TestCaseService],
})
export class TestCaseModule {}
