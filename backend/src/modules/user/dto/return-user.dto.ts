import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Expose } from 'class-transformer';

export class ReturnUserDto {
  constructor(
    id: string,
    email: string,
    username: string,
    points: number,
    totalSubmissions: number,
    totalResolved: number,
    streak: number,
    createdAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.points = points;
    this.totalSubmissions = totalSubmissions;
    this.totalResolved = totalResolved;
    this.streak = streak;
    this.createdAt = createdAt;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  points: number;

  @Expose({ name: 'total_submissions' })
  @ApiProperty({ name: 'total_submissions' })
  totalSubmissions: number;

  @Expose({ name: 'total_resolved' })
  @ApiProperty({ name: 'total_resolved' })
  totalResolved: number;

  @ApiProperty()
  streak: number;

  @Expose({ name: 'created_at' })
  @ApiProperty({ name: 'created_at' })
  createdAt: Date;

  static fromEntity(user: User) {
    return new ReturnUserDto(
      user.id,
      user.email,
      user.username,
      user.points,
      user.totalSubmissions,
      user.totalResolved,
      user.streak,
      user.createdAt,
    );
  }
}
