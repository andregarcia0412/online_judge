import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ type: 'text', default: 'pending' })
  status: string;

  @Column({ type: 'integer' })
  execution_time: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submission_date: Date;

  @Column({ type: 'text', nullable: true })
  error: string | null;
}
