import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Profession } from './professions.entity';

@Injectable()
export class ProfessionsService {
  constructor(
    private openaiService: OpenaiService,
    @InjectRepository(Profession)
    private professionsRepo: Repository<Profession>,
  ) {}

  async standardizeAndSave(rawProfession: string): Promise<Profession> {
    // 1. Sanitizar con OpenAI
    const { standardized, tags, category } = 
      await this.openaiService.standardizeProfession(rawProfession);

    // 2. Guardar en base de datos
    const profession = this.professionsRepo.create({
      rawName: rawProfession,
      standardizedName: standardized,
      tags,
      category,
      lastUsedAt: new Date(),
    });

    return this.professionsRepo.save(profession);
  }

  async findAll(): Promise<Profession[]> {
    return this.professionsRepo.find({ order: { lastUsedAt: 'DESC' } });
  }
}