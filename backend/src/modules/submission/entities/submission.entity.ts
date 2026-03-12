import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { StatusEnum } from '../enum/submission-status';

@Entity('Submission')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  id_user: string;

  @Column({ type: 'integer' })
  id_problem: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'text' })
  language: string;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.PENDING })
  status: StatusEnum;

  @Column({ type: 'integer' })
  execution_time: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submission_date: Date;

  @Column({ type: 'text', nullable: true })
  error: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  memoryUsageMB: number;
}
