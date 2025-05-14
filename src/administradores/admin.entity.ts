import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Admin {
  @ApiProperty({ example: "e5f3c3b2-6a2e-4d0a-98ab-58eae024712f", description: "UUID del administrador" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ example: "admin@example.com", description: "Correo electrónico del administrador" })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: "hashedpassword123", description: "Contraseña del administrador" })
  @Column()
  password: string;

  @ApiProperty({ example: true, description: "Estado del administrador (activo o inactivo)" })
  @Column({ default: true })
  status: boolean;

  @ApiProperty({ example: "Juan Pérez", description: "Nombre del administrador" })
  @Column()
  adminName: string;
}
