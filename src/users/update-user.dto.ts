import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional() // 👈 Hace que el password sea opcional
  @IsString()
  @MinLength(8)
  password?: string; // 👈 "?" indica que es opcional
}