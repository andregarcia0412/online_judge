import { ApiProperty } from '@nestjs/swagger';

export class HealthDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  uptime: number;

  @ApiProperty()
  timestamp: Date;

  constructor(status: string, uptime: number, timestamp: Date) {
    this.status = status;
    this.uptime = uptime;
    this.timestamp = timestamp;
  }
}
