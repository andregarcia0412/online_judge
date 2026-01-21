import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTestCaseDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id_problem: number;

  @IsString()
  @ApiProperty()
  input: string;

  @IsString()
  @ApiProperty()
  output: string;
}
