import { ApiProperty } from '@nestjs/swagger';

export class LlmResponseDto {
  @ApiProperty()
  message!: string;
}
