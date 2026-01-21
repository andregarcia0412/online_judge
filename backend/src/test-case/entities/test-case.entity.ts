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
}
