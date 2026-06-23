import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Problem } from './problem.entity';

@Entity('TestCase')
export class TestCase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Problem, (problem) => problem.testCases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_problem' })
  problem!: Problem;

  @Column({ type: 'integer' })
  id_problem!: number;

  @Column({ type: 'text', nullable: true })
  input!: string;

  @Column({ type: 'text', nullable: true })
  output!: string;
}
