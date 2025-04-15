import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}
