import { ApiProperty } from '@nestjs/swagger';

export class ReturnAvatarDto {
  @ApiProperty()
  avatarUrl: string | null;

  constructor(avatarUrl: string | null) {
    this.avatarUrl = avatarUrl;
  }
}
