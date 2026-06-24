import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @Expose({ name: 'refresh_token' })
  @IsJWT()
  @IsNotEmpty()
  @ApiProperty({ name: 'refresh_token' })
  refreshToken!: string;
}
