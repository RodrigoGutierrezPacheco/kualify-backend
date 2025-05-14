import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    example: 'NuevaContraseña123',
    description: 'Nueva contraseña del usuario (mínimo 8 caracteres)',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Nueva fecha de nacimiento del usuario (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;
}
