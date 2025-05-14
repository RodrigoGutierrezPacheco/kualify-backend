import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { UsersController } from "./user.controller";
import { DocumentosController } from "./../documentos/usuarios/documento-usuario.controller";
import { DocumentoService } from "src/documentos/usuarios/documento-usuario.service";
import { Documento } from "src/documentos/usuarios/documento-usuario.entity";
import { CloudinaryModule } from "src/cloudinary/cloudinaty.module";

@Module({
  imports: [TypeOrmModule.forFeature([User, Documento]), CloudinaryModule],
  controllers: [UsersController, DocumentosController],
  providers: [UsersService, DocumentoService],
  exports: [UsersService, DocumentoService],
})
export class UsersModule {}
