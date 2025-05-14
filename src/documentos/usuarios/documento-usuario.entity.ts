import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity()
export class Documento {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  tipo: 'acta_nacimiento' | 'comprobante_domicilio' | 'constancia_fiscal' | 'ine_pasaporte' | 'profile_image';

  @Column()
  url: string;

  @Column({ default: null })
  auditado: boolean;

  @Column({ nullable: true })
  comentario: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_subida: Date;

  @ManyToOne(() => User, usuario => usuario.documentos)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;
}

export class DocumentoConUsuarioDto{
  id: string;
  usuario:{
    id:string;
    email:string;
    username:string
  }
}