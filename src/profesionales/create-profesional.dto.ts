import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  IsIn,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProfesionalDto {
  @ApiProperty({
    description: 'Correo electrónico del profesional',
    example: 'ejemplo@correo.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Número de teléfono del profesional',
    example: '1234567890',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  phoneNumber: string;

  @ApiProperty({
    description: 'Nombre del profesional',
    example: 'Juan Pérez',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  profesionalname: string;

  @ApiProperty({
    description: 'País de origen del profesional',
    example: 'México',
    required: false,
  })
  @IsOptional()
  @IsString()
  pais?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del profesional',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiProperty({
    description: 'Género del profesional',
    example: 'masculino',
    enum: ['masculino', 'femenino', 'otro', ''],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(["masculino", "femenino", "otro", ""])
  genero?: string;

  @ApiProperty({
    description: 'Estado donde reside el profesional',
    example: 'CDMX',
    required: false,
  })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({
    description: 'Ciudad donde reside el profesional',
    example: 'Ciudad de México',
    required: false,
  })
  @IsOptional()
  @IsString()
  ciudad?: string;

  @ApiProperty({
    description: 'Contraseña para el profesional',
    example: '12345678',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
