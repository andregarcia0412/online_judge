import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LivenessResponseDto {
  constructor(status: string, uptime: number, startedAt: string) {
    this.status = status;
    this.uptime = uptime;
    this.startedAt = startedAt;
  }

  @ApiProperty()
  status: string;

  @ApiProperty()
  uptime: number;

  @Expose({ name: 'started_at' })
  @ApiProperty({ name: 'started_at', example: '2026-08-26T12:00:00.000Z' })
  startedAt: string;
}
