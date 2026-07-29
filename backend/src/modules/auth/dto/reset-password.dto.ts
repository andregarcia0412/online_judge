import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  Length,
  IsEmail,
} from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @Length(6)
  @IsNotEmpty()
  @ApiProperty()
  code!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @IsNotEmpty()
  @ApiProperty()
  password!: string;
}
