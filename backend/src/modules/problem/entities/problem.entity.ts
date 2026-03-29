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

  constructor(
    id: number,
    number: number,
    title: string,
    points: number,
    author: string,
    description: string,
    input_description: string,
    output_description: string,
    input_example: string,
    output_example: string,
    creation_date: Date,
  ) {
    this.id = id;
    this.number = number;
    this.title = title;
    this.points = points;
    this.author = author;
    this.description = description;
    this.input_description = input_description;
    this.output_description = output_description;
    this.input_example = input_example;
    this.output_example = output_example;
    this.creation_date = creation_date;
  }
}
