import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfesionalsController } from "./profesional.controller";
import { ProfesionalService } from "./profesional.service";
import { Profesional } from "./profesional.entity";
import { DocumentosController } from "../documentos/documento.controller";
import { DocumentoService } from "../documentos/documento.service";
import { Documento } from "../documentos/documento.entity";
import { CloudinaryModule } from "src/cloudinary/cloudinaty.module";
import { ProfesionesModule } from "./../professions/professions.module";
import { Profession } from "src/professions/professions.entity";
import { OpenaiModule } from "src/openai/openai.module";

@Module({
  imports: [
  TypeOrmModule.forFeature([Profesional, Documento, Profession]), // Añade Profesion
    CloudinaryModule,
    ProfesionesModule, // Importa el módulo de profesiones
    OpenaiModule
  ],
  providers: [
    ProfesionalService,
    DocumentoService
  ],
  controllers: [
    ProfesionalsController,
    DocumentosController
  ],
  exports: [
    ProfesionalService,
    DocumentoService
  ]
})
export class ProfesionalesModule {}