import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
