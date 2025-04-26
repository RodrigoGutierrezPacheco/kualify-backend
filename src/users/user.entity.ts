import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true , comment:"El email debe ser unico"})
  email: string;

  @Column({ unique: true, nullable: true, comment:"El telefono debe ser unico" })
  phoneNumber: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({ default: "user" })
  role: string;

  @Column({ default: true })
  status: boolean;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
