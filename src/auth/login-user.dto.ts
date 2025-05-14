// login-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email del usuario',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
    minLength: 8,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
