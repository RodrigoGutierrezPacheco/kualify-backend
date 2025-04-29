import { PartialType } from "@nestjs/mapped-types";
import { CreateProfesionalDto } from "./create-profesional.dto";
import {
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";

export class UptateProfesionalDto extends PartialType(CreateProfesionalDto) {
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;
}
