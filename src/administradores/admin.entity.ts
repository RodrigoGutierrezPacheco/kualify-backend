import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({default: true})
  status: boolean

  @Column()
  adminName: string;

  constructor(){
    if(!this.id){
      this.id = uuidv4();
    }
  }
}
