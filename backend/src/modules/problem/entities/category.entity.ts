import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryEnum } from '../enum/category.enum';

@Entity('Category')
export class Category {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'integer' })
  id_problem: number;

  @Column({ type: 'enum', enum: CategoryEnum })
  category: CategoryEnum;

  constructor(id: number, id_problem: number, category: CategoryEnum) {
    this.id = id;
    this.id_problem = id_problem;
    this.category = category;
  }
}
