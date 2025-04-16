import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfesionalsController } from "./profesional.controller";
import { ProfesionalService } from "./profesional.service";
import { Profesional } from "./profesional.entity";
import { DocumentosController } from "src/documentos/documento.controller";
import { DocumentoService } from "src/documentos/documento.service";
import { Documento } from "src/documentos/documento.entity";
import { CloudinaryModule } from "src/cloudinary/cloudinaty.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Profesional, Documento]), // Registra ambas entidades
    CloudinaryModule // Importa el módulo de Cloudinary
  ],
  providers: [
    ProfesionalService,
    DocumentoService // Registra el nuevo servicio
  ],
  controllers: [
    ProfesionalsController,
    DocumentosController // Agrega el nuevo controlador
  ],
  exports: [
    ProfesionalService,
    DocumentoService // Si otros módulos necesitan usar este servicio
  ]
})
export class ProfesionalesModule {}