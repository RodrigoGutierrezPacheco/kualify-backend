import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsOptional() // 👈 Hace que el password sea opcional
  @IsString()
  @MinLength(8)
  password?: string; // 👈 "?" indica que es opcional
}