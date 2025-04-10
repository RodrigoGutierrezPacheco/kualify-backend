import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesional } from './profesional.entity';

@Injectable()
export class ProfesionalesService {
  constructor(
    @InjectRepository(Profesional)
    private readonly profesionalRepository: Repository<Profesional>,
  ) {}

  async subirDocumentos(id: string, documentos: any[]) {
    const profesional = await this.profesionalRepository.findOneBy({ id });
    
    if (!profesional) {
      throw new NotFoundException(`Profesional con ID ${id} no encontrado`);
    }

    profesional.documentos = documentos;
    return this.profesionalRepository.save(profesional);
  }
}