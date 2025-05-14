import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiProperty({
    description: 'The password of the admin (optional).',
    example: 'newpassword123',
    minLength: 8,
    required: false, // Indica que es opcional
  })
  @IsOptional() // 👈 Hace que el password sea opcional
  @IsString()
  @MinLength(8)
  password?: string; // 👈 "?" indica que es opcional
}
