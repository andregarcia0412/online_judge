import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TestCase')
export class TestCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  id_problem: number;

  @Column({ type: 'text', nullable: true })
  input: string;

  @Column({ type: 'text', nullable: true })
  output: string;

  constructor(id: string, id_problem: number, input: string, output: string) {
    this.id = id;
    this.id_problem = id_problem;
    this.input = input;
    this.output = output;
  }
}
