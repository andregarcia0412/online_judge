import { ApiProperty } from '@nestjs/swagger';
import { ReturnUserDto } from 'src/user/dto/return-user.dto';

export class AuthResponseDto {
  constructor(
    token: string,
    refreshToken: string,
    expiresIn: number,
    user: ReturnUserDto,
  ) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
    this.user = user;
  }

  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  user: ReturnUserDto;
}
