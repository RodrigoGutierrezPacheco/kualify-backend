import { PartialType } from '@nestjs/mapped-types';
import { CreateProfesionalDto } from './create-profesional.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UptateProfesionalDto extends PartialType(CreateProfesionalDto) {
  @IsOptional() // 👈 Hace que el password sea opcional
  @IsString()
  @MinLength(8)
  password?: string; // 👈 "?" indica que es opcional
}