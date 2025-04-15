import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfesionalsController } from "./profesional.controller";
import { ProfesionalService } from "./profesional.service";
import { Profesional } from "./profesional.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Profesional])],
  providers: [ProfesionalService],
  controllers: [ProfesionalsController],
  exports: [ProfesionalService], // Si otros módulos necesitan usar este servicio
})
export class ProfesionalesModule {}
