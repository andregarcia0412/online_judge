import { ApiProperty } from '@nestjs/swagger';

export class InfoDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  version: string;

  constructor(name: string, version: string) {
    this.name = name;
    this.version = version;
  }
}
