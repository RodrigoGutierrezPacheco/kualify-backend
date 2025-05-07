import { Controller, Post, Body, Get } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { Profession } from './professions.entity';

@Controller('professions')
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Post('standardize')
  async standardize(
    @Body('profession') profession: string,
  ): Promise<Profession> {
    return this.professionsService.standardizeAndSave(profession);
  }

  @Get()
  async getAll(): Promise<Profession[]> {
    return this.professionsService.findAll();
  }
}