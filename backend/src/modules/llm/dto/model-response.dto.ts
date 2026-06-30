import { ApiProperty } from '@nestjs/swagger';

export class ModelResponseDto {
  @ApiProperty()
  message!: string;
}
