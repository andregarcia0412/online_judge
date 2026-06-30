import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AnalyzeRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code!: string;
}
