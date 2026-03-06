import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProblemDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  number: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @IsAlphanumeric()
  @ApiProperty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  points: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @IsAlphanumeric()
  @ApiProperty()
  author: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  @IsAlphanumeric()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiProperty()
  input_description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiProperty()
  output_description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiProperty()
  input_example: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiProperty()
  output_example: string;
}
