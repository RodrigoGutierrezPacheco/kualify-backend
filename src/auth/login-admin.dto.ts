// login-admin.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({
    example: 'admin@kualify.com',
    description: 'Email del administrador',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'AdminSecure123!',
    description: 'Contraseña de administrador',
    minLength: 10,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}