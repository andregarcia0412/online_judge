import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('RefreshToken')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  id_user: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'integer' })
  expires_in: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
