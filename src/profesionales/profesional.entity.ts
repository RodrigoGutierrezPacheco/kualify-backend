import { Entity, PrimaryGeneratedColumn, Column , OneToMany} from "typeorm";
import { Documento } from "src/documentos/documento.entity";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Profesional {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, comment: "El email debe ser unico" })	
  email: string;

  @Column({unique: true, nullable: true, comment:"El telefono debe ser unico" })	
  phoneNumber: string

  @Column()
  password: string;

  @Column()
  profesionalname: string;

  @Column({nullable: true, default:"México"})
  pais: string;

  @Column({nullable: true, default:null})
  fecha_nacimiento: string;

  @Column({nullable: true, default:null})
  genero: string;

  @Column({nullable: true, default:null})
  estado: string;

  @Column({nullable: true, default:null})
  ciudad: string;

  @Column({ default: 'profesional' })
  role: string;

  @OneToMany(() => Documento, documento => documento.profesional)
  documentos: Documento[];

  @Column({ default: true })
  status: boolean

  @Column({default: false})
  auditado: boolean

  constructor(){
    if(!this.id){
      this.id = uuidv4();
    }
  }
}
