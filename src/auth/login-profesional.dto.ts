// login-profesional.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginProfessionalDto {
  @ApiProperty({
    example: 'profesional@example.com',
    description: 'Email del profesional',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'ProfPassword123!',
    description: 'Contraseña del profesional',
    minLength: 8,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}