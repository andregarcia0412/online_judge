import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  points!: number;

  @Column({ name: 'total_submissions', type: 'integer', default: 0 })
  totalSubmissions!: number;

  @Column({ name: 'total_resolved', type: 'integer', default: 0 })
  totalResolved!: number;

  @Column({ type: 'integer', default: 0 })
  streak!: number;

  @Column({ type: 'timestamp', name: 'last_submission_date', nullable: true })
  lastSubmissionDate!: Date;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
