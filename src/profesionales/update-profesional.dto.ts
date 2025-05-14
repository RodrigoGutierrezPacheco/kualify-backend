import { PartialType } from "@nestjs/mapped-types";
import { CreateProfesionalDto } from "./create-profesional.dto";
import {
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';

export class UptateProfesionalDto extends PartialType(CreateProfesionalDto) {
  @ApiProperty({
    description: 'La nueva contraseña del profesional. Debe tener al menos 8 caracteres.',
    example: 'newPassword123',
    required: false, // Este campo es opcional
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del profesional en formato ISO 8601.',
    example: '1990-01-01',
    required: false, // Este campo es opcional
  })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiProperty({
    description: 'Lista de especialidades del profesional.',
    example: ['Cardiología', 'Pediatría'],
    required: false, // Este campo es opcional
    type: [String], // Esto indica que es un arreglo de cadenas de texto
  })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  especialidades?: string[];
}
