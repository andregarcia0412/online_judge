import { ApiProperty } from '@nestjs/swagger';

export class AskResponseDto {
  @ApiProperty()
  response: string;
}
