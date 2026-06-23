import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsJWT()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken!: string;
}
