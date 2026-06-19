import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
