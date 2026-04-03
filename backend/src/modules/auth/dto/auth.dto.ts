import { ApiProperty } from '@nestjs/swagger';
import { ReturnUserDto } from 'src/modules/user/dto/return-user.dto';

export class AuthResponseDto {
  constructor(accessToken: string, refreshToken: string, user: ReturnUserDto) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
  }

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: ReturnUserDto;
}
