import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class ReturnUserDto {
  constructor(
    id: string,
    email: string,
    username: string,
    points: number,
    total_submissions: number,
    total_resolved: number,
    streak: number,
    creation_date: Date,
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.points = points;
    this.total_submissions = total_submissions;
    this.total_resolved = total_resolved;
    this.streak = streak;
    this.creation_date = creation_date;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  points: number;

  @ApiProperty()
  total_submissions: number;

  @ApiProperty()
  total_resolved: number;

  @ApiProperty()
  streak: number;

  @ApiProperty()
  creation_date: Date;

  static fromEntity(user: User) {
    return new ReturnUserDto(
      user.id,
      user.email,
      user.username,
      user.points,
      user.total_submissions,
      user.total_resolved,
      user.streak,
      user.creation_date,
    );
  }
}
