import { PartialType } from '@nestjs/mapped-types';
import { CreateTestCaseDto } from './create-test-case.dto';

export class UpdateTestCaseDto extends PartialType(CreateTestCaseDto) {}
