import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Problem')
export class Problem {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'integer', unique: true })
  number: number;

  @Column({ type: 'text', unique: true })
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  points: number;

  @Column({ type: 'text' })
  author: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  input_description: string;

  @Column({ type: 'text' })
  output_description: string;

  @Column({ type: 'text', nullable: true })
  input_example: string;

  @Column({ type: 'text', nullable: true })
  output_example: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creation_date: Date;
}
