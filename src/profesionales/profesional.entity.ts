import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Profesional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column('jsonb', { nullable: true })
  documentos?: any[];
}