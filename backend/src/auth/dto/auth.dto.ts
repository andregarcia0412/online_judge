import { ApiProperty } from '@nestjs/swagger';
import { ReturnUserDto } from 'src/user/dto/return-user.dto';

export class AuthResponseDto {
  constructor(token: string, expiresIn: number, user: ReturnUserDto) {
    this.token = token;
    this.expiresIn = expiresIn;
    this.user = user;
  }

  @ApiProperty()
  token: string;
  @ApiProperty()
  expiresIn: number;
  @ApiProperty()
  user: ReturnUserDto;
}
