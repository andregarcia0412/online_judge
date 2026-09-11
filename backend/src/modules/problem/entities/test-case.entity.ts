import {
  Column,
  Entity,
  Index,
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

  @Index()
  @Column({ name: 'id_problem', type: 'integer' })
  idProblem!: number;

  @Column({ type: 'text', nullable: true })
  input!: string;

  @Column({ type: 'text', nullable: true })
  output!: string;
}
