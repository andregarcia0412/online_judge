import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEnum } from '../enum/category.enum';
import { Problem } from './problem.entity';

@Entity('Category')
export class Category {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @ManyToOne(() => Problem, (problem) => problem.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_problem' })
  problem!: Problem;

  @Column({ name: 'id_problem', type: 'integer' })
  idProblem!: number;

  @Column({ type: 'enum', enum: CategoryEnum })
  category!: CategoryEnum;
}
