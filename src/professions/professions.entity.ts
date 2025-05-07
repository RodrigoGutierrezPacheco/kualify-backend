import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Profession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rawName: string; // Nombre original ingresado

  @Column()
  standardizedName: string; // Nombre estandarizado

  @Column('simple-array')
  tags: string[];

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUsedAt: Date;
}