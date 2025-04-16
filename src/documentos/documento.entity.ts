import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Profesional } from 'src/profesionales/profesional.entity';

@Entity()
export class Documento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: 'acta_nacimiento' | 'comprobante_domicilio' | 'constancia_fiscal' | 'ine_pasaporte';

  @Column()
  url: string;

  @Column({ default: false })
  auditado: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_subida: Date;

  @ManyToOne(() => Profesional, profesional => profesional.documentos)
  @JoinColumn({ name: 'profesional_id' })
  profesional: Profesional;
}