import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesionalesService } from './profesionales.service';
import { ProfesionalesController } from './profesionales.controller';
import { Profesional } from './profesional.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profesional])],
  providers: [ProfesionalesService],
  controllers: [ProfesionalesController],
  exports: [ProfesionalesService] // Si otros módulos necesitan usar este servicio
})
export class ProfesionalesModule {}