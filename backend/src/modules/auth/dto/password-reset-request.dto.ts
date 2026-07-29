import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class PasswordResetRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  email!: string;
}
