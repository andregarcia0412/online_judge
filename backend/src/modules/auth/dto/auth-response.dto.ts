import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthResponseDto {
  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  @Expose({ name: 'access_token' })
  @ApiProperty({ name: 'access_token' })
  accessToken: string;

  @Expose({ name: 'refresh_token' })
  @ApiProperty({ name: 'refresh_token' })
  refreshToken: string;
}
