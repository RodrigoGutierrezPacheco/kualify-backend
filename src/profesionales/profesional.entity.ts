import { Entity, PrimaryGeneratedColumn, Column , OneToMany} from "typeorm";
import { Documento } from "src/documentos/documento.entity";

@Entity()
export class Profesional {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  profesionalname: string;

  @Column({ default: 'profesional' })
  role: string;

  @OneToMany(() => Documento, documento => documento.profesional)
  documentos: Documento[];

  @Column({ default: true })
  status: boolean

  @Column({default: false})
  auditado: boolean
}
