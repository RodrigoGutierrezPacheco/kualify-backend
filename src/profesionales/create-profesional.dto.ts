// create-profesional.dto.ts
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  IsIn,
} from "class-validator";

export class CreateProfesionalDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  phoneNumber: string;

  @IsString()
  @MinLength(3)
  profesionalname: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsOptional()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsString()
  @IsIn(["masculino", "femenino", "otro", ""])
  genero?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;

  @IsString()
  @MinLength(8)
  password: string;
}
