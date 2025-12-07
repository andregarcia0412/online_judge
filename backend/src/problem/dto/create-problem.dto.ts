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
  number: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @IsAlphanumeric()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  points: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @IsAlphanumeric()
  author: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  @IsAlphanumeric()
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  input_description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  output_description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  input_example: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  output_example: string;
}
