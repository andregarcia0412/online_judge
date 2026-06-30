import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AskRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  language!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message!: string;
}
