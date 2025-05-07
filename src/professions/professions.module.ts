// profesiones/profesiones.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profession } from './professions.entity';
import { ProfessionsService } from './professions.service';
import { ProfessionsController } from './professions.controller';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([Profession]),
    OpenaiModule, // Importa OpenaiModule
  ],
  controllers: [ProfessionsController],
  providers: [ProfessionsService],
  exports: [ProfessionsService, TypeOrmModule], // Exporta el servicio y TypeOrmModule
})
export class ProfesionesModule {}