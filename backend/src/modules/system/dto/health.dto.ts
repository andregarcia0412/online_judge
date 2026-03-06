export class HealthDto {
  status: string;
  uptime: number;
  timestamp: Date;

  constructor(status: string, uptime: number, timestamp: Date) {
    this.status = status;
    this.uptime = uptime;
    this.timestamp = timestamp;
  }
}
